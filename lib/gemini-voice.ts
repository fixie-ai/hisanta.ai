import { GoogleGenerativeAI } from '@google/generative-ai';

// Voice session states
export enum VoiceSessionState {
  IDLE = 'idle',
  LISTENING = 'listening',
  THINKING = 'thinking',
  SPEAKING = 'speaking',
  ERROR = 'error',
}

export interface VoiceSessionError {
  message: string;
  code?: string;
}

export interface VoiceSessionInit {
  asrProvider?: string;
  ttsProvider?: string;
  ttsVoice?: string;
  model?: string;
  webrtcUrl?: string;
}

export interface GeminiVoiceSessionConfig {
  apiKey: string;
  characterId: string;
  systemPrompt: string;
  greetingMessage?: string;
  init: VoiceSessionInit;
}

/**
 * GeminiVoiceSession - A voice session implementation using Google Gemini AI
 * This replaces the Fixie VoiceSession with a Gemini-based implementation
 */
export class GeminiVoiceSession {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private state: VoiceSessionState = VoiceSessionState.IDLE;
  private conversationHistory: Array<{ role: string; parts: string }> = [];

  public conversationId: string;
  public roomName: string | null = null;
  public onStateChange?: (state: VoiceSessionState) => void;
  public onLatencyChange?: (kind: string, latency: number) => void;
  public onError?: (error: VoiceSessionError) => void;

  private systemPrompt: string;
  private greetingMessage?: string;
  private ttsVoice: string;
  private modelName: string;
  private isActive: boolean = false;
  private asrStartTime: number = 0;
  private llmStartTime: number = 0;
  private ttsStartTime: number = 0;

  constructor(config: GeminiVoiceSessionConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.conversationId = `gemini_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.systemPrompt = config.systemPrompt;
    this.greetingMessage = config.greetingMessage;
    this.ttsVoice = config.init.ttsVoice || '';
    this.modelName = this.mapModelName(config.init.model || 'gemini-pro');

    // Initialize Gemini model
    this.model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: this.systemPrompt,
    });

    // Initialize chat with history
    this.chat = this.model.startChat({
      history: this.conversationHistory,
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.9,
        topP: 1,
        topK: 40,
      },
    });

    // Initialize Web Speech API if available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  /**
   * Map old model names to Gemini model names
   */
  private mapModelName(oldModel?: string): string {
    const modelMap: Record<string, string> = {
      'gpt-4': 'gemini-1.5-pro',
      'gpt-4-1106-preview': 'gemini-1.5-pro',
      'gpt-4-32k': 'gemini-1.5-pro',
      'gpt-3.5-turbo': 'gemini-1.5-flash',
      'gpt-3.5-turbo-16k': 'gemini-1.5-flash',
      'claude-2': 'gemini-1.5-pro',
      'claude-instant-1': 'gemini-1.5-flash',
    };

    return modelMap[oldModel || ''] || 'gemini-1.5-pro';
  }

  /**
   * Initialize Web Speech Recognition
   */
  private initSpeechRecognition() {
    if (typeof window === 'undefined') return;

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.asrStartTime = Date.now();
      this.setState(VoiceSessionState.LISTENING);
    };

    this.recognition.onresult = async (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log('Recognized speech:', transcript);

      // Measure ASR latency
      const asrLatency = Date.now() - this.asrStartTime;
      this.onLatencyChange?.('asr', asrLatency);

      // Process with Gemini
      await this.processUserInput(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.onError?.({ message: `Speech recognition error: ${event.error}` });
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      if (this.isActive && this.state !== VoiceSessionState.SPEAKING) {
        // Restart recognition if still active
        setTimeout(() => {
          if (this.isActive) {
            this.recognition?.start();
          }
        }, 100);
      }
    };
  }

  /**
   * Process user input through Gemini
   */
  private async processUserInput(text: string) {
    try {
      this.setState(VoiceSessionState.THINKING);
      this.llmStartTime = Date.now();

      // Send message to Gemini
      const result = await this.chat.sendMessage(text);
      const response = await result.response;
      const responseText = response.text();

      // Measure LLM latency
      const llmLatency = Date.now() - this.llmStartTime;
      this.onLatencyChange?.('llm', llmLatency);
      this.onLatencyChange?.('llmt', llmLatency); // Token latency (simplified)

      console.log('Gemini response:', responseText);

      // Speak the response
      await this.speakText(responseText);

    } catch (error: any) {
      console.error('Error processing user input:', error);
      this.onError?.({ message: error.message });
      this.setState(VoiceSessionState.LISTENING);
    }
  }

  /**
   * Speak text using Web Speech API or custom TTS
   */
  private async speakText(text: string) {
    if (!this.synthesis) {
      console.error('Speech synthesis not available');
      this.setState(VoiceSessionState.LISTENING);
      return;
    }

    this.setState(VoiceSessionState.SPEAKING);
    this.ttsStartTime = Date.now();

    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);

      // Try to find a matching voice
      const voices = this.synthesis!.getVoices();
      const voice = voices.find(v => v.voiceURI.includes('English')) || voices[0];
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        console.log('Started speaking');
      };

      utterance.onend = () => {
        const ttsLatency = Date.now() - this.ttsStartTime;
        this.onLatencyChange?.('tts', ttsLatency);
        console.log('Finished speaking');
        this.setState(VoiceSessionState.LISTENING);
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        this.onError?.({ message: `Speech synthesis error: ${event.error}` });
        this.setState(VoiceSessionState.LISTENING);
        reject(event);
      };

      this.synthesis!.speak(utterance);
    });
  }

  /**
   * Set the session state
   */
  private setState(state: VoiceSessionState) {
    this.state = state;
    this.onStateChange?.(state);
  }

  /**
   * Warmup the session (prepare resources)
   */
  async warmup(): Promise<void> {
    console.log('Warming up Gemini voice session');
    // Preload voices if using Web Speech API
    if (this.synthesis) {
      this.synthesis.getVoices();
    }
  }

  /**
   * Start audio capture
   */
  async startAudio(): Promise<void> {
    console.log('Starting audio capture');
    try {
      // Request microphone permission
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize audio context
      this.audioContext = new AudioContext();

      // Initialize speech recognition
      this.initSpeechRecognition();

      this.setState(VoiceSessionState.IDLE);
    } catch (error: any) {
      console.error('Error starting audio:', error);
      throw new Error(`Failed to start audio: ${error.message}`);
    }
  }

  /**
   * Start the voice session
   */
  async start(): Promise<void> {
    console.log('Starting Gemini voice session');
    this.isActive = true;

    // Speak greeting if available
    if (this.greetingMessage) {
      await this.speakText(this.greetingMessage);
    }

    // Start listening
    if (this.recognition) {
      this.recognition.start();
    } else {
      this.setState(VoiceSessionState.LISTENING);
    }
  }

  /**
   * Stop the voice session
   */
  stop(): void {
    console.log('Stopping Gemini voice session');
    this.isActive = false;

    // Stop recognition
    if (this.recognition) {
      this.recognition.stop();
    }

    // Stop speech synthesis
    if (this.synthesis) {
      this.synthesis.cancel();
    }

    // Stop media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
    }

    this.setState(VoiceSessionState.IDLE);
  }

  /**
   * Get current state
   */
  getState(): VoiceSessionState {
    return this.state;
  }
}

/**
 * GeminiClient - Simplified client for creating Gemini voice sessions
 */
export class GeminiClient {
  private apiKey: string;

  constructor(options: { apiKey?: string } = {}) {
    this.apiKey = options.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  }

  createVoiceSession(config: {
    characterId: string;
    systemPrompt: string;
    greetingMessage?: string;
    init: VoiceSessionInit;
  }): GeminiVoiceSession {
    return new GeminiVoiceSession({
      apiKey: this.apiKey,
      characterId: config.characterId,
      systemPrompt: config.systemPrompt,
      greetingMessage: config.greetingMessage,
      init: config.init,
    });
  }
}
