"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ChatManager, ChatManagerState, createChatManager } from '../../agent/chat';

const CallSanta = () => {
  interface LatencyThreshold {
    good: number;
    fair: number;
  }
  
  const DEFAULT_ASR_PROVIDER = 'deepgram';
  const DEFAULT_TTS_PROVIDER = 'playht';
  const DEFAULT_LLM = 'gpt-4-1106-preview';
  const ASR_PROVIDERS = ['aai', 'deepgram', 'gladia', 'revai', 'soniox'];
  const TTS_PROVIDERS = [
    'aws',
    'azure',
    'eleven',
    'eleven-ws',
    'gcp',
    'lmnt',
    'lmnt-ws',
    'murf',
    'openai',
    'playht',
    'resemble',
    'wellsaid',
  ];
  const LLM_MODELS = [
    'claude-2',
    'claude-instant-1',
    'gpt-4',
    'gpt-4-32k',
    'gpt-4-1106-preview',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k',
  ];
  const AGENT_IDS = ['ai-friend', 'dr-donut', 'rubber-duck'];
  const LATENCY_THRESHOLDS: { [key: string]: LatencyThreshold } = {
    ASR: { good: 300, fair: 500 },
    LLM: { good: 300, fair: 500 },
    LLMT: { good: 300, fair: 400 },
    TTS: { good: 400, fair: 600 },
    Total: { good: 1300, fair: 2000 },
  };
  
  const updateSearchParams = (param: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(param, value);
    window.location.search = params.toString();
  };

  const searchParams = useSearchParams();
  // const agentId = searchParams.get('agent') || 'dr-donut';
  const agentId = '5d37e2c5-1e96-4c48-b3f1-98ac08d40b9a';
  const tapOrClick = typeof window != 'undefined' && 'ontouchstart' in window ? 'Tap' : 'Click';
  const idleText = `${tapOrClick} anywhere to start!`;
  const asrProvider = searchParams.get('asr') || DEFAULT_ASR_PROVIDER;
  const asrLanguage = searchParams.get('asrLanguage') || undefined;
  const ttsProvider = searchParams.get('tts') || DEFAULT_TTS_PROVIDER;
  const ttsModel = searchParams.get('ttsModel') || undefined;
  const ttsVoice = searchParams.get('ttsVoice') || undefined;
  const model = searchParams.get('llm') || DEFAULT_LLM;
  const docs = searchParams.get('docs') !== null;
  const webrtcUrl = searchParams.get('webrtc') ?? undefined;

  const [chatManager, setChatManager] = useState<ChatManager | null>();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [helpText, setHelpText] = useState(idleText);
  const [asrLatency, setAsrLatency] = useState(0);
  const [llmResponseLatency, setLlmResponseLatency] = useState(0);
  const [llmTokenLatency, setLlmTokenLatency] = useState(0);
  const [ttsLatency, setTtsLatency] = useState(0);
  const active = () => chatManager && chatManager!.state != ChatManagerState.IDLE;
  useEffect(() => init(), [asrProvider, asrLanguage, ttsProvider, ttsModel, ttsVoice, model, agentId, docs]);
  const init = () => {
    console.log(`[page] init asr=${asrProvider} tts=${ttsProvider} llm=${model} agent=${agentId} docs=${docs}`);
    const manager = createChatManager({
      asrProvider,
      asrLanguage,
      ttsProvider,
      ttsModel,
      ttsVoice,
      model,
      agentId,
      docs,
      webrtcUrl,
    });
    setChatManager(manager);
    manager.onStateChange = (state) => {
      switch (state) {
        case ChatManagerState.LISTENING:
          setHelpText('Listening...');
          break;
        case ChatManagerState.THINKING:
          setHelpText(`Thinking... ${tapOrClick.toLowerCase()} to cancel`);
          break;
        case ChatManagerState.SPEAKING:
          setHelpText(`Speaking... ${tapOrClick.toLowerCase()} to interrupt`);
          break;
        default:
          setHelpText(idleText);
      }
    };



    manager.onError = () => {
      manager.stop();
    };
    return () => manager.stop();
  };

  const handleStart = () => {
    chatManager!.start('');
  };
  const handleStop = () => {
    chatManager!.stop();
  };
  const speak = () => (handleStart());
  
  const handleClick = () => {
    alert('Calling Santa');
    speak();

  };
  return (
    <div className="bg-white rounded-3xl border-black border-2 flex space-x-2 w-full mt-4">
      <div className="w-12 h-12 bg-gray-500 rounded-full border-2 border-black items-center justify-center m-2">
        <div className="m-1">
          <Image
            src="/images/santa-svg.svg"
            alt="Santa Image"
            width={40}
            height={40}
          /></div>
      </div>
      <div onClick={handleClick} className="bg-green-900 rounded-3xl align-middle text-white justify-center p-2 flex flex-row m-1 w-10/12">
        <div className="mt-1">
          <Image
            src="/images/phone.svg"
            alt="Santa Image"
            width={20}
            height={600}
          />
        </div>
        <div className="text-lg mt-1">&nbsp;Call Santa Now</div>
      </div>
    </div>
    
  );
};

export default CallSanta;