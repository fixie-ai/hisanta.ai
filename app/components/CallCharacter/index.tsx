"use client";
import { useEffect, useMemo, useState } from "react";
import { CharacterType } from "@/lib/types";
import ActiveCall from "../ActiveCall";
import StartNewCall from "../StartNewCall";
import { Howl } from "howler";
import { FixieClient } from "fixie";
import {
  VoiceSession,
  VoiceSessionInit,
  VoiceSessionState,
} from "fixie/src/voice";
import { DebugSheet } from "../DebugSheet";
import { CheckTooBusy } from "../CheckTooBusy";
import { useFlags } from "launchdarkly-react-client-sdk";

const API_KEY = process.env.NEXT_PUBLIC_FIXIE_API_KEY;
const DEFAULT_ASR_PROVIDER = "deepgram";
const DEFAULT_TTS_PROVIDER = "eleven-ws";
const DEFAULT_LLM = "gpt-4-1106-preview";

// Santa.
const FIXIE_AGENT_ID = "5d37e2c5-1e96-4c48-b3f1-98ac08d40b9a";

// Santa voice.
const DEFAULT_TTS_VOICE = "Kp00queBTLslXxHCu1jq";

// The following are not currently used but will be useful when we bring back debug UI.
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
interface LatencyThreshold {
  good: number;
  fair: number;
}
const LATENCY_THRESHOLDS: { [key: string]: LatencyThreshold } = {
  ASR: { good: 300, fair: 500 },
  LLM: { good: 300, fair: 500 },
  LLMT: { good: 300, fair: 400 },
  TTS: { good: 400, fair: 600 },
  Total: { good: 1300, fair: 2000 },
};

/** Create a VoiceSession with the given parameters. */
function makeVoiceSession({
  agentId,
  asrProvider,
  ttsProvider,
  ttsVoice,
  model,
  onInputChange,
  onOutputChange,
  onLatencyChange,
  onStateChange,
}: {
  agentId: string;
  asrProvider?: string;
  ttsProvider?: string;
  ttsVoice?: string;
  model?: string;
  onInputChange?: (text: string, final: boolean) => void;
  onOutputChange?: (text: string, final: boolean) => void;
  onLatencyChange?: (kind: string, latency: number) => void;
  onStateChange?: (state: VoiceSessionState) => void;
}): VoiceSession {
  console.log(`[makeVoiceSession] creating voice session with LLM ${model}`);
  const fixieClient = new FixieClient({ apiKey: API_KEY });
  const voiceInit: VoiceSessionInit = {
    asrProvider: asrProvider || DEFAULT_ASR_PROVIDER,
    ttsProvider: ttsProvider || DEFAULT_TTS_PROVIDER,
    ttsVoice: ttsVoice || DEFAULT_TTS_VOICE,
    model: model || DEFAULT_LLM,
  };
  const session = fixieClient.createVoiceSession({
    agentId,
    init: voiceInit,
  });
  console.log(`[makeVoiceSession] created voice session`);
  session.onInputChange = onInputChange;
  session.onOutputChange = onOutputChange;
  session.onLatencyChange = onLatencyChange;
  session.onStateChange = onStateChange;
  session.onError = () => {
    console.error("Voice session error");
    session.stop();
  };
  return session;
}

export interface VoiceSessionStats {
  state: VoiceSessionState | null;
  asrLatency: number;
  llmResponseLatency: number;
  llmTokenLatency: number;
  ttsLatency: number;
};

export function CallCharacter({ character }: { character: CharacterType }) {
  const [inCall, setInCall] = useState(false);
  const [voiceSession, setVoiceSession] = useState<VoiceSession | null>(null);
  const [startingCall, setStartingCall] = useState(false);
  const [startRequested, setStartRequested] = useState(false);
  const [debugSheetOpen, setDebugSheetOpen] = useState(false);
  const [stats, setStats] = useState<VoiceSessionStats>({
    state: null,
    asrLatency: -1,
    llmResponseLatency: -1,
    llmTokenLatency: -1,
    ttsLatency: -1,
  });
  const { llmModel } = useFlags();

  useEffect(() => {
    setInCall(false);
    setVoiceSession(null);
    setStartingCall(false);
    setStartRequested(false);
  }, [character.characterId]);

  const ringtone = useMemo(
    () =>
      new Howl({
        src: [character.ringtone],
        preload: true,
        volume: 0.7,
        onend: function () {
          onRingtoneFinished();
        },
      }),
    [character.ringtone]
  );

  const hangup = new Howl({
    src: "/sounds/hangup.mp3",
    preload: true,
    volume: 0.2,
    onend: function () {
      onHangupFinished();
    },
  });

  useEffect(() => {
    return () => {
      ringtone.stop();
      if (voiceSession) {
        console.log(`CallCharacter: cleanup - stopping voice session`);
        voiceSession.stop();
      }
    };
  }, [ringtone, voiceSession]);

  useEffect(() => {
    if (startRequested && voiceSession) {
      console.log(`CallCharacter: onRingtoneFinished - starting voice session`);
      voiceSession.start();
      setStartingCall(false);
      setInCall(true);
    }
  }, [startRequested, voiceSession]);

  const onCallStart = () => {
    console.log(`CallCharacter: onCallStart`);
    if (startingCall) {
      console.log(`CallCharacter: onCallStart - already starting call`);
      return;
    }
    setStartingCall(true);
    // This can be slow since it is doing a WebRTC connection. Instead it should return
    // immediately and we can initiate the warmup asynchronously.
    const session = makeVoiceSession({
      agentId: character.agentId,
      ttsVoice: character.voiceId,
      model: llmModel,
      onInputChange: (text, final) => {},
      onOutputChange: (text, final) => {},
      onLatencyChange: (kind, latency) => {
        console.log(`CallCharacter: latency: ${kind} ${latency}`);
        switch (kind) {
          case "asr":
            setStats(curStats => ({
              ...curStats,
              asrLatency: latency,
              llmResponseLatency: 0,
              llmTokenLatency: 0,
              ttsLatency: 0,
            }));
            break;
          case "llm":
            setStats(curStats => ({
              ...curStats,
              llmResponseLatency: latency,
            }));
            break;
          case "llmt":
            setStats(curStats => ({
              ...curStats,
              llmTokenLatency: latency,
            }));
            break;
          case "tts":
            setStats(curStats => ({
              ...curStats,
              ttsLatency: latency,
            }));
            break;
        }
      },
      onStateChange: (state) => {
        console.log(`CallCharacter: session state: ${state}`);
        setStats(curStats => ({
          ...curStats,
          state,
        }));
      },
    });
    console.log(`CallCharacter: created voice session`);
    session.startAudio(); // This will prompt for mic permission.

    setVoiceSession(session);
    // Wait a beat before starting the ringtone.
    setTimeout(() => {
      ringtone.play();
    }, 200);
  };

  const onRingtoneFinished = () => {
    console.log(`CallCharacter: onRingtoneFinished`);
    setStartRequested(true);
  };

  const onCallEnd = () => {
    console.log(`CallCharacter: onCallEnd`);
    hangup.play();
    voiceSession?.stop();
    setVoiceSession(null);
    setStartRequested(false);
  };

  const onHangupFinished = () => {
    console.log(`CallCharacter: onHangupFinished`);
    setInCall(false);
  };

  const onDebugOpen = () => {
    setDebugSheetOpen(true);
  };

  return (
    <CheckTooBusy>
      {inCall && voiceSession ? (
        <ActiveCall
          voiceSession={voiceSession}
          onCallEnd={onCallEnd}
          character={character}
          onDebugOpen={onDebugOpen}
        />
      ) : (
        <StartNewCall
          startCallEnabled={!startingCall}
          onCallStart={onCallStart}
          character={character}
        />
      )}
      <DebugSheet open={debugSheetOpen} onOpenChange={setDebugSheetOpen} stats={stats} />
    </CheckTooBusy>
  );
}
