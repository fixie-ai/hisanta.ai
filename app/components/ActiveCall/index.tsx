"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CharacterType } from "@/lib/types";
import { MicrophoneIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { FixieClient } from "fixie";
import {
  VoiceSession,
  VoiceSessionInit,
  VoiceSessionState,
} from "fixie/src/voice";

interface LatencyThreshold {
  good: number;
  fair: number;
}

const API_KEY = process.env.NEXT_PUBLIC_FIXIE_API_KEY;
const FIXIE_AGENT_ID = "5d37e2c5-1e96-4c48-b3f1-98ac08d40b9a";
const DEFAULT_TTS_VOICE = "Kp00queBTLslXxHCu1jq";
const DEFAULT_ASR_PROVIDER = "deepgram";
//const DEFAULT_TTS_PROVIDER = "playht";
const DEFAULT_TTS_PROVIDER = "eleven-ws";
const DEFAULT_LLM = "gpt-4-1106-preview";
const ASR_PROVIDERS = ["aai", "deepgram", "gladia", "revai", "soniox"];
const TTS_PROVIDERS = [
  "aws",
  "azure",
  "eleven",
  "eleven-ws",
  "gcp",
  "lmnt",
  "lmnt-ws",
  "murf",
  "openai",
  "playht",
  "resemble",
  "wellsaid",
];
const LLM_MODELS = [
  "claude-2",
  "claude-instant-1",
  "gpt-4",
  "gpt-4-32k",
  "gpt-4-1106-preview",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
];
const AGENT_IDS = ["ai-friend", "dr-donut", "rubber-duck"];
const LATENCY_THRESHOLDS: { [key: string]: LatencyThreshold } = {
  ASR: { good: 300, fair: 500 },
  LLM: { good: 300, fair: 500 },
  LLMT: { good: 300, fair: 400 },
  TTS: { good: 400, fair: 600 },
  Total: { good: 1300, fair: 2000 },
};

let voiceSession: VoiceSession | null = null;

function makeVoiceSession({
  asrProvider,
  ttsProvider,
  ttsVoice,
  model,
  onInputChange,
  onOutputChange,
  onLatencyChange,
  onStateChange,
}: {
  asrProvider: string;
  ttsProvider: string;
  ttsVoice: string;
  model: string;
  onInputChange: (text: string, final: boolean) => void;
  onOutputChange: (text: string, final: boolean) => void;
  onLatencyChange: (kind: string, latency: number) => void;
  onStateChange: (state: VoiceSessionState) => void;
}): VoiceSession {
  if (voiceSession) {
    return voiceSession;
  }

  const fixieClient = new FixieClient({ apiKey: API_KEY });
  const voiceInit: VoiceSessionInit = {
    asrProvider: asrProvider,
    ttsProvider: ttsProvider,
    ttsVoice: ttsVoice,
    model: model,
  };
  const session = fixieClient.createVoiceSession({
    agentId: FIXIE_AGENT_ID,
    init: voiceInit,
  });
  console.log(
    `[makeVoiceSession] created voice session ${JSON.stringify(session)}`
  );
  session.onInputChange = onInputChange;
  session.onOutputChange = onOutputChange;
  session.onLatencyChange = onLatencyChange;
  session.onStateChange = onStateChange;
  session.onError = () => {
    session.stop();
  };

  // TODO(mdw): I am not sure what happened to these.
  // session.onAudioGenerate = (latency) => {
  //   setLlmTokenLatency(latency);
  // };
  // session.onAudioStart = (latency) => {
  //   setTtsLatency(latency);
  // };
  voiceSession = session;
  return session;
}

function Conversation({
  character,
  onCallEnd,
  stopRingtone,
}: {
  character: CharacterType;
  onCallEnd: () => void;
  stopRingtone: () => void;
}) {
  const searchParams = useSearchParams();
  const asrProvider = searchParams.get("asr") || DEFAULT_ASR_PROVIDER;
  const ttsProvider = searchParams.get("tts") || DEFAULT_TTS_PROVIDER;
  const ttsModel = searchParams.get("ttsModel") || undefined;
  const ttsVoice = searchParams.get("ttsVoice") || DEFAULT_TTS_VOICE;
  const model = searchParams.get("llm") || DEFAULT_LLM;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [asrLatency, setAsrLatency] = useState(0);
  const [llmResponseLatency, setLlmResponseLatency] = useState(0);
  const [llmTokenLatency, setLlmTokenLatency] = useState(0);
  const [ttsLatency, setTtsLatency] = useState(0);

  const [showChooser, setShowChooser] = useState(
    searchParams.get("chooser") !== null
  );
  const showInput = searchParams.get("input") !== null;
  const showOutput = searchParams.get("output") !== null;
  const [showStats, setShowStats] = useState(
    searchParams.get("stats") !== null
  );
  const [voiceSession, setVoiceSession] = useState<VoiceSession | null>(null);
  const [starting, setStarting] = useState(false);
  const cleanupPromiseRef = useRef<Promise<void>>();

  useEffect(() => {
    let createdSession = false;
    if (!starting) {
      setStarting(true);

      const session = makeVoiceSession({
        asrProvider,
        ttsProvider,
        ttsVoice,
        model,
        onInputChange: (text, final) => {
          setInput(text);
        },
        onOutputChange: (text, final) => {
          setOutput(text);
          if (final) {
            setInput("");
          }
        },
        onLatencyChange: (kind, latency) => {
          switch (kind) {
            case "asr":
              setAsrLatency(latency);
              setLlmResponseLatency(0);
              setLlmTokenLatency(0);
              setTtsLatency(0);
              break;
            case "llm":
              setLlmResponseLatency(latency);
              break;
            case "llmt":
              setLlmTokenLatency(latency);
              break;
            case "tts":
              setTtsLatency(latency);
              break;
          }
        },
        onStateChange: (state) => {
          // Stop ringtone.
          console.log("Stopping ringtone");
          stopRingtone();
        },
      });

      //setInput("");
      //setOutput("");
      //setAsrLatency(0);
      //setLlmResponseLatency(0);
      //setLlmTokenLatency(0);
      //setTtsLatency(0);

      createdSession = true;
      console.log("[VoiceSession] doStart");
      session.start();
      setVoiceSession(session);
    }

    return createdSession
      ? () => {
          cleanupPromiseRef.current = new Promise<void>(
            async (resolve, reject) => {
              console.log(`Cleanup calling session.stop`);
              await voiceSession?.stop();
              resolve();
            }
          );
          cleanupPromiseRef.current.then(() => {
            console.log(`Finalized session stop`);
          });
        }
      : undefined;
  }, [asrProvider, model, ttsProvider, ttsVoice, voiceSession, starting]);

  // // Start the voice session.
  // const doStart = async () => {
  //   console.log("[VoiceSession] doStart");
  //   setInput("");
  //   setOutput("");
  //   setAsrLatency(0);
  //   setLlmResponseLatency(0);
  //   setLlmTokenLatency(0);
  //   setTtsLatency(0);
  //   voiceSession.start();
  // };

  // Handle end call event.
  const handleStop = async () => {
    await voiceSession?.stop();
    onCallEnd();
  };

  // Handle interrupt click.
  const onInterruptClick = () => {
    if (voiceSession && voiceSession.state != VoiceSessionState.IDLE) {
      voiceSession.interrupt();
    }
  };

  return (
    <>
      <Visualizer
        character={character}
        voiceSession={voiceSession || undefined}
      />
      <button onClick={handleStop}>
        <div className="bg-white rounded-3xl align-middle text-[#881425] justify-center w-11/12 p-2 flex flex-row mx-auto mb-4 border-[#881425] border">
          <div className="text-lg mt-1">&nbsp;End call</div>
        </div>
      </button>
    </>
  );
}

function Visualizer({
  character,
  voiceSession,
}: {
  character: CharacterType;
  voiceSession?: VoiceSession;
}) {
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const [outputVu, setOutputVu] = useState(0);

  if (voiceSession && voiceSession.inputAnalyzer) {
    voiceSession.inputAnalyzer.fftSize = 64;
    voiceSession.inputAnalyzer.maxDecibels = 0;
    voiceSession.inputAnalyzer.minDecibels = -70;
  }

  if (voiceSession && voiceSession.outputAnalyzer) {
    // We use a larger FFT size for the output analyzer because it's typically fullband,
    // versus the wideband input analyzer, resulting in a similar bin size for each.
    // Then, when we grab the lowest 16 bins from each, we get a similar spectrum.
    voiceSession.outputAnalyzer.fftSize = 256;
    voiceSession.outputAnalyzer.maxDecibels = 0;
    voiceSession.outputAnalyzer.minDecibels = -70;
  }

  const visualizeOutput = (freqData?: Uint8Array) => {
    if (!outputCanvasRef.current) return;
    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grd = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      20,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    grd.addColorStop(0, "rgb(13,87,83,1)");
    grd.addColorStop(1, "rgb(13,87,83,0)");
    ctx.fillStyle = grd;

    if (freqData) {
      const vu = Math.floor(
        freqData.reduce((a, b) => a + b, 0) / freqData.length
      );
      const smoothed = vu * 0.5 + outputVu * 0.5;
      setOutputVu(smoothed);
      const radius = canvas.width / 5 + (smoothed / 128) * canvas.width * 2;
      ctx.beginPath();
      ctx.ellipse(
        canvas.width / 2,
        canvas.height / 2,
        radius,
        radius,
        0,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  const visualizeInput = (freqData?: Uint8Array) => {
    if (!inputCanvasRef.current) return;
    const canvas = inputCanvasRef.current;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (freqData) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const vu =
        Math.floor(freqData.reduce((a, b) => a + b, 0) / freqData.length) * 2;
      ctx.fillStyle = "rgb(13,87,83,0.5)";
      ctx.fillRect(0, canvas.height - vu, canvas.width, vu);
    }
  };

  const render = () => {
    //console.log(`[Visualizer] render: ${voiceSession?.state}`);
    if (!voiceSession) return;
    let freqData: Uint8Array = new Uint8Array(0);
    switch (voiceSession.state) {
      case VoiceSessionState.IDLE:
        break;

      case VoiceSessionState.LISTENING:
        if (!voiceSession.inputAnalyzer) return;
        freqData = new Uint8Array(voiceSession.inputAnalyzer.frequencyBinCount);
        voiceSession.inputAnalyzer.getByteFrequencyData(freqData);
        freqData = freqData.slice(0, 16);
        visualizeInput(freqData);
        requestAnimationFrame(render);
        break;

      // For now, "THINKING" also means "SPEAKING".
      case VoiceSessionState.THINKING:
      case VoiceSessionState.SPEAKING:
        if (!voiceSession.outputAnalyzer) return;
        freqData = new Uint8Array(
          voiceSession.outputAnalyzer.frequencyBinCount
        );
        voiceSession.outputAnalyzer.getByteFrequencyData(freqData);
        freqData = freqData.slice(0, 16);
        visualizeOutput(freqData);
        requestAnimationFrame(render);
        break;
    }
  };

  useEffect(() => {
    render();
  }, [
    voiceSession,
    voiceSession?.state,
    voiceSession?.inputAnalyzer,
    voiceSession?.outputAnalyzer,
  ]);

  const showState = () => {
    if (voiceSession == null) {
      return "Calling...";
    } else if (voiceSession.state === VoiceSessionState.IDLE) {
      return "Calling...";
    } else if (voiceSession.state === VoiceSessionState.LISTENING) {
      return "Listening...";
    } else {
      return "Speaking...";
    }
  };

  return (
    <>
      {/* Output indicator */}
      <div className="mx-auto relative w-[40vmin] h-[40vmin]">
        <canvas
          className="absolute top-0 left-0 w-full h-full z-25"
          ref={outputCanvasRef}
          width={300}
          height={300}
        />
        <div className="absolute top-0 left-0 w-full h-full z-30">
          <img
            className="mx-auto my-auto w-[250px] h-full"
            src={`/images/${character.image}`}
            alt="Santa Image"
            width={250}
            height={250}
          />
        </div>
      </div>

      {/* Speaking indicator */}
      <div className="bg-white relative mx-auto w-11/12 h-12 rounded-full items-center">
        <canvas
          className="absolute top-0 left-0 w-full h-full z-25 rounded-full"
          ref={inputCanvasRef}
          width={300}
          height={300}
        />
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <div className="flex flex-row justify-center items-center align-middle p-2">
            <MicrophoneIcon className="w-6 h-6" />
            <div className="text-lg mt-1">{showState()}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ActiveCall({
  character,
  onCallEnd,
  stopRingtone,
}: {
  character: CharacterType;
  onCallEnd: () => void;
  stopRingtone: () => void;
}) {
  return (
    <div className="bg-slate-100 rounded-3xl border-black border-2 flex flex-col w-11/12 mx-auto md:mt-4 gap-4">
      <div className="mt-4 mx-auto text-3xl text-[#881425]">
        {character.name}
      </div>
      <Conversation stopRingtone={stopRingtone} character={character} onCallEnd={onCallEnd} />
    </div>
  );
}
