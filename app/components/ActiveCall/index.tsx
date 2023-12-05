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
import { set } from "lodash";

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
}: {
  character: CharacterType;
  onCallEnd: () => void;
}) {
  console.log(
    `[Conversation] called with character ${JSON.stringify(character)}`
  );

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
  const [sessionState, setSessionState] = useState<VoiceSessionState | null>(
    null
  );
  const [starting, setStarting] = useState(false);

  if (voiceSession == null && !starting) {
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
          setSessionState(state);
        },
      });

    console.log("[VoiceSession] doStart");
    //setInput("");
    //setOutput("");
    //setAsrLatency(0);
    //setLlmResponseLatency(0);
    //setLlmTokenLatency(0);
    //setTtsLatency(0);
    session.start();
    setVoiceSession(session);
  }

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
    if (sessionState != VoiceSessionState.IDLE) {
      voiceSession?.interrupt();
    }
  };

  const showState = () => {
    if (sessionState == null) {
      return "Initializing...";
    } else if (sessionState == VoiceSessionState.IDLE) {
      return "Idle";
    } else if (sessionState == VoiceSessionState.LISTENING) {
      return "Listening...";
    } else {
      return "Speaking...";
    }
  }

  return (
    <>
      <Visualizer character={character} />
      <button className="mt-1" onClick={onInterruptClick}>
        <div className="bg-white rounded-3xl align-middle justify-center items-center p-2 flex flex-row m-1">
          <MicrophoneIcon className="w-6 h-6" />
          <div className="text-lg mt-1">
            { showState() }
          </div>
        </div>
      </button>
      <button onClick={handleStop} className="mt-1">
        <div className="bg-white rounded-3xl align-middle text-[#881425] justify-center p-2 flex flex-row m-1 border-[#881425] border-2">
          <PhoneIcon className="w-6 h-6" />
          <div className="text-lg mt-1">&nbsp;End call</div>
        </div>
      </button>
    </>
  );
}

function Visualizer({
  character,
  state,
  inputAnalyzer,
  outputAnalyzer,
}: {
  character: CharacterType;
  state?: VoiceSessionState;
  inputAnalyzer?: AnalyserNode;
  outputAnalyzer?: AnalyserNode;
}) {
  return (
    <div className="mx-auto">
      <Image
        className="drop-shadow-md"
        src={`/images/${character.image}`}
        alt="Santa Image"
        width={300}
        height={300}
      />
    </div>
  );
}

export default function ActiveCall({
  character,
  onCallEnd,
}: {
  character: CharacterType;
  onCallEnd: () => void;
}) {
  return (
    <div className="bg-slate-100 rounded-3xl border-black border-4 flex flex-col w-full mt-4 gap-4">
      <div className="mt-4 mx-auto text-3xl text-[#881425]">
        {character.name}
      </div>
      <Conversation character={character} onCallEnd={onCallEnd} />
    </div>
  );
}
