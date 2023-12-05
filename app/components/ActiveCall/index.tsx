"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

function Conversation({
  character,
  onCallEnd,
}: {
  character: CharacterType;
  onCallEnd: () => void;
}) {
  const searchParams = useSearchParams();
  const asrProvider = searchParams.get("asr") || DEFAULT_ASR_PROVIDER;
  const asrLanguage = searchParams.get("asrLanguage") || undefined;
  const ttsProvider = searchParams.get("tts") || DEFAULT_TTS_PROVIDER;
  const ttsModel = searchParams.get("ttsModel") || undefined;
  const ttsVoice = searchParams.get("ttsVoice") || DEFAULT_TTS_VOICE;
  const model = searchParams.get("llm") || DEFAULT_LLM;
  const docs = searchParams.get("docs") !== null;
  const webrtcUrl = searchParams.get("webrtc") ?? undefined;
  const [showChooser, setShowChooser] = useState(
    searchParams.get("chooser") !== null
  );
  const showInput = searchParams.get("input") !== null;
  const showOutput = searchParams.get("output") !== null;
  const [showStats, setShowStats] = useState(
    searchParams.get("stats") !== null
  );
  const [voiceSession, setVoiceSession] = useState<VoiceSession | null>();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [asrLatency, setAsrLatency] = useState(0);
  const [llmResponseLatency, setLlmResponseLatency] = useState(0);
  const [llmTokenLatency, setLlmTokenLatency] = useState(0);
  const [ttsLatency, setTtsLatency] = useState(0);

  const active = () =>
    voiceSession && voiceSession!.state != VoiceSessionState.IDLE;

  useEffect(() => {
    const init = () => {
      console.log(
        `[VoiceSession] init asr=${asrProvider} tts=${ttsProvider} ttsVoice=${ttsVoice} llm=${model} agent=${FIXIE_AGENT_ID} docs=${docs}`
      );
      const voiceInit: VoiceSessionInit = {
        asrProvider: asrProvider,
        ttsProvider: ttsProvider,
        ttsVoice: ttsVoice,
        model: model,
      };
      const API_KEY = process.env.NEXT_PUBLIC_FIXIE_API_KEY;
      const fixieClient = new FixieClient({ apiKey: API_KEY });
      const session = fixieClient.createVoiceSession({
        agentId: FIXIE_AGENT_ID,
        init: voiceInit,
      });
      setVoiceSession(session);

      session.onInputChange = (text, final) => {
        setInput(text);
      };
      session.onOutputChange = (text, final) => {
        setOutput(text);
        if (final) {
          setInput('');
        }
      };
      session.onLatencyChange = (kind, latency) => {
        switch (kind) {
          case 'asr':
            setAsrLatency(latency);
            setLlmResponseLatency(0);
            setLlmTokenLatency(0);
            setTtsLatency(0);
            break;
          case 'llm':
            setLlmResponseLatency(latency);
            break;
          case 'llmt':
            setLlmTokenLatency(latency);
            break;
          case 'tts':
            setTtsLatency(latency);
            break;
        }
      };

      // TODO(mdw): I am not sure what happened to these.
      // session.onAudioGenerate = (latency) => {
      //   setLlmTokenLatency(latency);
      // };
      // session.onAudioStart = (latency) => {
      //   setTtsLatency(latency);
      // };
      session.onError = () => {
        session.stop();
      };

      return () => session.stop();
    };
    init();
  }, [asrProvider, asrLanguage, ttsProvider, ttsModel, ttsVoice, model, docs]);

  const updateSearchParams = (param: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(param, value);
    window.location.search = params.toString();
  };

  const handleStart = () => {
      setInput("");
      setOutput("");
      setAsrLatency(0);
      setLlmResponseLatency(0);
      setLlmTokenLatency(0);
      setTtsLatency(0);
      voiceSession!.start();
  }

  const handleStop = async () => {
    await voiceSession!.stop();
    onCallEnd();
  };

  const onInterruptClick = () => active() ? voiceSession!.interrupt() : handleStart();

  return (
    <>
      <Visualizer character={character} />
      <button className="mt-1" onClick={onInterruptClick}>
        <div className="bg-white rounded-3xl align-middle justify-center items-center p-2 flex flex-row m-1">
          <MicrophoneIcon className="w-6 h-6" />
          <div className="text-lg mt-1">
            {active() ? "Interrupt" : "Start talking"}
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
