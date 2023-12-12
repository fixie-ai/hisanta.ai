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
import { track as vercelTrack } from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useWakeLock } from "react-screen-wake-lock";
import { CallFeedback } from "../CallFeedback";
import { datadogRum } from "@datadog/browser-rum";

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

function track(eventName: string, eventMetadata?: Record<string, string | number | boolean>) {
  datadogRum.addAction(eventName, eventMetadata);
  vercelTrack(eventName, eventMetadata);
}

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
  onError,
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
  onError?: () => void;
}): VoiceSession {
  console.log(`[makeVoiceSession] creating voice session with LLM ${model}`);
  console.log(`USING API KEY: ${API_KEY}`);
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
    onError?.();
  };
  return session;
}

export interface VoiceSessionStats {
  state: VoiceSessionState | null;
  asrLatency: number;
  llmResponseLatency: number;
  llmTokenLatency: number;
  ttsLatency: number;
}

/**
 * This is the main component allowing the user to call a given character.
 * It shows the <ActiveCall> or <StartNewCall> components depending on whether
 * the call is active. It creates and manages the Fixie VoiceSession object
 * and passes that down to the ActiveCall component.
 */
export function CallCharacter({ character }: { character: CharacterType }) {
  const searchParams = useSearchParams();
  const [inCall, setInCall] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
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
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const router = useRouter();
  const model = searchParams.get("model") || llmModel;
  const { isSupported, released, request, release } = useWakeLock({
    onRequest: () => console.log("Screen wake lock requested"),
    onError: () => console.error("Error with wake lock"),
    onRelease: () => console.log("Screen wake lock released"),
  });

  useEffect(() => {
    setInCall(false);
    setVoiceSession(null);
    setStartingCall(false);
    setStartRequested(false);
    track("character-selected", {
      character: character.characterId,
    });
  }, [character.characterId]);

  // Ringtone sound effect. This is specific to the character.
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

  // Hangup sound effect.
  const hangup = new Howl({
    src: "/sounds/hangup.mp3",
    preload: true,
    volume: 0.2,
    onend: function () {
      onHangupFinished();
    },
  });

  // Cleanup handler.
  useEffect(() => {
    return () => {
      ringtone.stop();
      if (voiceSession) {
        console.log(`CallCharacter: cleanup - stopping voice session`);
        voiceSession.stop();
      }
    };
  }, [ringtone, voiceSession]);

  // Start voice session if requested by user.
  useEffect(() => {
    if (startRequested && voiceSession) {
      console.log(`CallCharacter: onRingtoneFinished - starting voice session`);
      voiceSession.start();
      setStartingCall(false);
      setInCall(true);
      setCallStartTime(Date.now());
      track("call-started", {
        character: character.characterId,
        conversationId: voiceSession.conversationId || '',
      });
    }
  }, [character.characterId, startRequested, voiceSession]);

  // Called by <StartNewCall> when the user clicks the "Call" button.
  const onCallStart = () => {
    console.log(`CallCharacter: onCallStart`);
    if (startingCall) {
      console.log(`CallCharacter: onCallStart - already starting call`);
      return;
    }
    track("call-start-requested", {
      character: character.characterId,
    });
    setStartingCall(true);
    // Request wake lock if not already held.
    if (released) {
      request();
    }
    const session = makeVoiceSession({
      agentId: character.agentId,
      ttsVoice: character.voiceId,
      model: model,
      onInputChange: (text, final) => {},
      onOutputChange: (text, final) => {},
      onLatencyChange: (kind, latency) => {
        console.log(`CallCharacter: latency: ${kind} ${latency}`);
        switch (kind) {
          case "asr":
            setStats((curStats) => ({
              ...curStats,
              asrLatency: latency,
              llmResponseLatency: 0,
              llmTokenLatency: 0,
              ttsLatency: 0,
            }));
            track("asr-latency-measured", {
              conversationId: voiceSession?.conversationId || '',
              asrLatency: latency,
            });
            break;
          case "llm":
            setStats((curStats) => ({
              ...curStats,
              llmResponseLatency: latency,
            }));
            track("llm-latency-measured", {
              conversationId: voiceSession?.conversationId || '',
              llmLatency: latency,
            });
            break;
          case "llmt":
            setStats((curStats) => ({
              ...curStats,
              llmTokenLatency: latency,
            }));
            track("llm-token-latency-measured", {
              conversationId: voiceSession?.conversationId || '',
              llmTokenLatency: latency,
            });
            break;
          case "tts":
            setStats((curStats) => ({
              ...curStats,
              ttsLatency: latency,
            }));
            track("tts-latency-measured", {
              conversationId: voiceSession?.conversationId || '',
              ttsLatency: latency,
            });
            break;
        }
      },
      onStateChange: (state) => {
        console.log(`CallCharacter: session state: ${state}`);
        setStats((curStats) => ({
          ...curStats,
          state,
          conversationId: voiceSession?.conversationId || '',
        }));
        track("voice-session-state-changed", {
          conversationId: voiceSession?.conversationId || '',
          state: state,
        });
      },
      onError: () => {
        track("voice-session-error", {
          conversationId: voiceSession?.conversationId || '',
        });
      },
    });
    console.log(`CallCharacter: created voice session`);
    session.warmup();
    session.startAudio(); // This will prompt for mic permission.

    setVoiceSession(session);
    // Wait a beat before starting the ringtone.
    setTimeout(() => {
      ringtone.play();
    }, 1000);
  };

  // Invoked when ringtone is done ringing.
  const onRingtoneFinished = () => {
    console.log(`CallCharacter: onRingtoneFinished`);
    setStartRequested(true);
  };

  // Called when user hangs up the call.
  const onCallEnd = () => {
    console.log(`CallCharacter: onCallEnd - conversation ID: ${voiceSession?.conversationId}`);
    hangup.play();
    voiceSession?.stop();
    setVoiceSession(null);
    setStartRequested(false);
    // Release wake lock.
    release();
    track("call-ended", {
      conversationId: voiceSession?.conversationId || '',
    });
    const callDuration = callStartTime ? Date.now() - callStartTime : 0;
    track("call-duration", {
      duration: callDuration,
      conversationId: voiceSession?.conversationId || '',
    });
  };

  // Invoked when hangup sound effect is done playing.
  const onHangupFinished = () => {
    console.log(`CallCharacter: onHangupFinished`);
    setInCall(false);
    setFeedbackDialogOpen(true);
  };

  // Invoked when the debug window is opened.
  const onDebugOpen = () => {
    track("debug-menu-opened", {
      character: character.characterId,
    });
    setDebugSheetOpen(true);
  };

  // Invoked when the debug submit button is clicked.
  const onDebugSubmit = (newCharacter?: string, newModel?: string) => {
    track("debug-menu-submitted", {
      character: newCharacter || "unknown",
      model: model || "unknown",
    });
    setDebugSheetOpen(false);
    if (newModel) {
      router.push(
        `/${newCharacter || character.characterId}?model=${newModel}`
      );
    } else {
      router.push(`/${newCharacter || character.characterId}`);
    }
  };

  // Invoked when user submits call feedback.
  const onFeedback = (good: boolean) => {
    console.log(`onFeedback - conversationId ${voiceSession?.conversationId} good ${good}`);
    track("call-feedback-received", {
      conversationId: voiceSession?.conversationId || '',
      callGood: good,
    });
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
          onDebugOpen={onDebugOpen}
        />
      )}
      <CallFeedback character={character} open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen} onFeedback={onFeedback} />
      <DebugSheet
        open={debugSheetOpen}
        onOpenChange={setDebugSheetOpen}
        voiceSession={voiceSession}
        stats={stats}
        inCall={inCall}
        llmModels={LLM_MODELS}
        onSubmit={onDebugSubmit}
      />
    </CheckTooBusy>
  );
}
