"use client";
import { useEffect, useRef, useState } from "react";
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
import { set } from "lodash";

const API_KEY = process.env.NEXT_PUBLIC_FIXIE_API_KEY;
const FIXIE_AGENT_ID = "5d37e2c5-1e96-4c48-b3f1-98ac08d40b9a";
const DEFAULT_TTS_VOICE = "Kp00queBTLslXxHCu1jq";
const DEFAULT_ASR_PROVIDER = "deepgram";
const DEFAULT_TTS_PROVIDER = "eleven-ws";
const DEFAULT_LLM = "gpt-4-1106-preview";

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

let voiceSession: VoiceSession | null = null;

/** Create a VoiceSession with the given parameters. */
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
  asrProvider?: string;
  ttsProvider?: string;
  ttsVoice?: string;
  model?: string;
  onInputChange?: (text: string, final: boolean) => void;
  onOutputChange?: (text: string, final: boolean) => void;
  onLatencyChange?: (kind: string, latency: number) => void;
  onStateChange?: (state: VoiceSessionState) => void;
}): VoiceSession {
  if (voiceSession) {
    return voiceSession;
  }
  const fixieClient = new FixieClient({ apiKey: API_KEY });
  const voiceInit: VoiceSessionInit = {
    asrProvider: asrProvider || DEFAULT_ASR_PROVIDER,
    ttsProvider: ttsProvider || DEFAULT_TTS_PROVIDER,
    ttsVoice: ttsVoice || DEFAULT_TTS_VOICE,
    model: model || DEFAULT_LLM,
  };
  const session = fixieClient.createVoiceSession({
    agentId: FIXIE_AGENT_ID,
    init: voiceInit,
  });
  console.log(`[makeVoiceSession] created voice session`);
  session.onInputChange = onInputChange;
  session.onOutputChange = onOutputChange;
  session.onLatencyChange = onLatencyChange;
  session.onStateChange = onStateChange;
  session.onError = () => {
    console.log("*********************** Voice session error");
    session.stop();
  };
  voiceSession = session;
  return session;
}

export function CallCharacter({ character }: { character: CharacterType }) {
  const [inCall, setInCall] = useState(false);
  const [voiceSession, setVoiceSession] = useState<VoiceSession | null>(null);
  const [startingCall, setStartingCall] = useState(false);
  const [startRequested, setStartRequested] = useState(false);
  //const cleanupPromiseRef = useRef<Promise<void>>();

  const ringtone = new Howl({
    src: [character.ringtone],
    preload: true,
    volume: 0.7,
    onend: function () {
      onRingtoneFinished();
    },
  });

  const hangup = new Howl({
    src: "/sounds/hangup.mp3",
    preload: true,
    volume: 0.2,
    onend: function () {
      onHangupFinished();
    },
  });

  useEffect(() => {
    if (startRequested && voiceSession) {
      console.log(`CallCharacter: onRingtoneFinished - starting voice session`);
      voiceSession.start();
      setStartingCall(false);
      setInCall(true);
    }
  }, [startRequested, voiceSession]);

  // XXX MDW - Because the constructor for VoiceSession creates the AudioContext,
  // we cannot create the VoiceSession "early". It might be possible to fix this by
  // deferring creation of the VoiceSession AudioContext (or just calling .resume on it)
  // when we call voiceSession.start(). For now, though, I need to create the VoiceSession
  // in the click handler for the onCallStart button. We still play the ringtone before we
  // do a .start(), though, so we have time for the connection to complete.

  // useEffect(() => {
  //   let createdSession = false;
  //   if (!initialized) {
  //     setInitialized(true);
  //     const session = makeVoiceSession({
  //       onInputChange: (text, final) => {},
  //       onOutputChange: (text, final) => {},
  //       onLatencyChange: (kind, latency) => {},
  //       onStateChange: (state) => {
  //         console.log(`CallCharacter: session state: ${state}`);
  //       },
  //     });
  //     createdSession = true;
  //     setVoiceSession(session);
  //   }
  //   return createdSession
  //     ? () => {
  //         cleanupPromiseRef.current = new Promise<void>(
  //           async (resolve, reject) => {
  //             console.log(`Cleanup calling session.stop`);
  //             await voiceSession?.stop();
  //             resolve();
  //           }
  //         );
  //         cleanupPromiseRef.current.then(() => {
  //           console.log(`Finalized session stop`);
  //         });
  //       }
  //     : undefined;
  // }, [voiceSession, initialized]);

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
      onInputChange: (text, final) => {},
      onOutputChange: (text, final) => {},
      onLatencyChange: (kind, latency) => {},
      onStateChange: (state) => {
        console.log(`CallCharacter: session state: ${state}`);
      },
    });
    console.log(`CallCharacter: created voice session`);
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

  return inCall && voiceSession ? (
    <ActiveCall
      voiceSession={voiceSession}
      onCallEnd={onCallEnd}
      character={character}
    />
  ) : (
    <StartNewCall
      startCallEnabled={!startingCall}
      onCallStart={onCallStart}
      character={character}
    />
  );
}
