"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
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

const DEFAULT_ASR_PROVIDER = "deepgram";
const DEFAULT_TTS_PROVIDER = "eleven-ws";
const DEFAULT_LLM = "gpt-4-1106-preview";

// Number of times to play ringtone by default.
const DEFAULT_RING_COUNT = 1;

// Santa voice.
const DEFAULT_TTS_VOICE = "Kp00queBTLslXxHCu1jq";

const LLM_MODELS = [
  "claude-2",
  "claude-instant-1",
  "gpt-4",
  "gpt-4-32k",
  "gpt-4-1106-preview",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
];

/** Send metrics to Datadog and Vercel. */
function track(
  eventName: string,
  eventMetadata?: Record<string, string | number | boolean>
) {
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
}: {
  agentId: string;
  asrProvider?: string;
  ttsProvider?: string;
  ttsVoice?: string;
  model?: string;
}): VoiceSession {
  console.log(`[makeVoiceSession] creating voice session with LLM ${model}`);
  const fixieClient = new FixieClient({});
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
  const { llmModel, numRings } = useFlags();
  const [ringCount, setRingCount] = useState(0);
  const [targetRingCount, setTargetRingCount] = useState(0);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const router = useRouter();
  const model = searchParams.get("model") || llmModel;
  const { isSupported, released, request, release } = useWakeLock({
    onRequest: () => console.log("Screen wake lock requested"),
    onError: () => console.error("Error with wake lock"),
    onRelease: () => console.log("Screen wake lock released"),
  });

  // Invoked when ringtone is done ringing.
  const onRingtoneFinished = () => {
    console.log(`CallCharacter: onRingtoneFinished`);
    setRingCount((count) => count + 1);
  };

  // The character's ringtone.
  const ringtone = useMemo(
    () =>
      new Howl({
        src: [character.ringtone],
        preload: true,
        volume: 0.7,
        onend: onRingtoneFinished,
      }),
    [character.ringtone]
  );

  // If we're ringing, check ring count and either re-play ringtone or set startRequested.
  useEffect(() => {
    console.log(
      `CallCharacter: checking rings - ${ringCount} / ${targetRingCount}`
    );
    if (targetRingCount > 0) {
      if (ringCount < targetRingCount) {
        console.log(
          `CallCharacter: ringtone count ${ringCount} - playing again`
        );
        ringtone!.play();
      } else {
        console.log(
          `CallCharacter: ringtone count ${ringCount} - done playing`
        );
        setTargetRingCount(0);
        setStartRequested(true);
      }
    }
  }, [ringtone, ringCount, targetRingCount]);

  // Reset state when character changes.
  useEffect(() => {
    track("character-selected", {
      character: character.characterId,
    });
    setInCall(false);
    setVoiceSession(null);
    setStartingCall(false);
    setStartRequested(false);
  }, [character.characterId]);

  // Cleanup handler.
  useEffect(() => {
    console.log(`CallCharacter: cleanup - stopping voice session`);
    return () => {
      ringtone.stop();
      if (voiceSession) {
        console.log(`CallCharacter: cleanup - stopping voice session`);
        voiceSession.stop();
      }
    };
  }, [voiceSession, ringtone]);

  // Start voice session.
  useEffect(() => {
    if (startRequested && voiceSession) {
      console.log(
        `CallCharacter[${voiceSession.conversationId}]: starting voice session`
      );
      voiceSession.start();
      setStartingCall(false);
      setInCall(true);
      setCallStartTime(Date.now());
      track("call-started", {
        character: character.characterId,
        conversationId: voiceSession.conversationId || "",
      });
    }
  }, [character.characterId, startRequested, voiceSession]);

  // Called by <StartNewCall> when the user clicks the "Call" button. Creates a voice session
  // and kicks off ringtones, if needed.
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
    // Request wake lock. `released` will be undefined here.
    if (isSupported) {
      request();
    }
    const session = makeVoiceSession({
      agentId: character.agentId,
      ttsVoice: character.voiceId,
      model: model,
    });

    session.onLatencyChange = (kind: string, latency: number) => {
      console.log(
        `CallCharacter[${session.conversationId}]: latency: ${kind} ${latency}`
      );
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
            conversationId: session.conversationId || "",
            asrLatency: latency,
          });
          break;
        case "llm":
          setStats((curStats) => ({
            ...curStats,
            llmResponseLatency: latency,
          }));
          track("llm-latency-measured", {
            conversationId: session.conversationId || "",
            llmLatency: latency,
          });
          break;
        case "llmt":
          setStats((curStats) => ({
            ...curStats,
            llmTokenLatency: latency,
          }));
          track("llm-token-latency-measured", {
            conversationId: session.conversationId || "",
            llmTokenLatency: latency,
          });
          break;
        case "tts":
          setStats((curStats) => ({
            ...curStats,
            ttsLatency: latency,
          }));
          track("tts-latency-measured", {
            conversationId: session.conversationId || "",
            ttsLatency: latency,
          });
          break;
      }
    };

    session.onStateChange = (state: VoiceSessionState) => {
      console.log(
        `CallCharacter[${session.conversationId}]: session state: ${state}`
      );
      setStats((curStats) => ({
        ...curStats,
        state,
        conversationId: session.conversationId || "",
      }));
      track("voice-session-state-changed", {
        conversationId: session.conversationId || "",
        state: state,
      });
    };
    session.onError = () => {
      console.log(
        `CallCharacter[${session.conversationId}]: voiceSession error`
      );
      track("voice-session-error", {
        conversationId: session.conversationId || "",
      });
      session.stop();
    };

    console.log(`CallCharacter: created voice session`);
    session.warmup();
    session.startAudio(); // This will prompt for mic permission.
    setVoiceSession(session);

    console.log(
      `CallCharacter: playing ringtone ${numRings ?? DEFAULT_RING_COUNT} times`
    );
    if ((numRings ?? DEFAULT_RING_COUNT) > 0) {
      // Wait a beat before starting the ringtone.
      setRingCount(0);
      setTimeout(() => {
        console.log(`CallCharacter: setting target ring count to ${numRings ?? DEFAULT_RING_COUNT}`);
        setTargetRingCount(numRings ?? DEFAULT_RING_COUNT);
      }, 1000);
    } else {
      // No need to ring - just start.
      setStartRequested(true);
    }
  };

  // Invoked when hangup sound effect is done playing.
  const onHangupFinished = () => {
    console.log(
      `CallCharacter[${voiceSession?.conversationId}]: onHangupFinished`
    );
    setInCall(false);
    setFeedbackDialogOpen(true);
  };

  // This is the hangup sound effect.
  const hangup = new Howl({
    src: "/sounds/hangup.mp3",
    preload: true,
    volume: 0.2,
    onend: function () {
      onHangupFinished();
    },
  });

  // Called when user hangs up the call.
  const onCallEnd = () => {
    console.log(`CallCharacter[${voiceSession?.conversationId}]: onCallEnd`);
    hangup.play();
    voiceSession?.stop();
    setStartRequested(false);
    // Release wake lock.
    if (isSupported) {
      release();
    }
    track("call-ended", {
      conversationId: voiceSession?.conversationId || "",
    });
    const callDuration = callStartTime ? Date.now() - callStartTime : 0;
    track("call-duration", {
      duration: callDuration,
      conversationId: voiceSession?.conversationId || "",
    });
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
    console.log(
      `CallCharacter[${voiceSession?.conversationId}] - onFeedback: good ${good}`
    );
    track("call-feedback-received", {
      conversationId: voiceSession?.conversationId || "",
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
      <CallFeedback
        character={character}
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        onFeedback={onFeedback}
      />
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
