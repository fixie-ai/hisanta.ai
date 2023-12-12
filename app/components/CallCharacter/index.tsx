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
      console.log(
        `CallCharacter[${voiceSession.conversationId}]: onRingtoneFinished - starting voice session`
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

  // Called by <StartNewCall> when the user clicks the "Call" button.
  const onCallStart = useCallback(() => {
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
    // Wait a beat before starting the ringtone.
    setTimeout(() => {
      ringtone.play();
    }, 1000);
  }, [character, model, released, request, ringtone, startingCall]);

  // Invoked when ringtone is done ringing.
  const onRingtoneFinished = () => {
    console.log(`CallCharacter: onRingtoneFinished`);
    setStartRequested(true);
  };

  // Invoked when hangup sound effect is done playing.
  const onHangupFinished = useCallback(() => {
    console.log(
      `CallCharacter[${voiceSession?.conversationId}]: onHangupFinished`
    );
    setInCall(false);
    setFeedbackDialogOpen(true);
  }, [voiceSession]);

  // Called when user hangs up the call.
  const onCallEnd = useCallback(() => {
    console.log(`CallCharacter[${voiceSession?.conversationId}]: onCallEnd`);
    const hangup = new Howl({
      src: "/sounds/hangup.mp3",
      preload: true,
      volume: 0.2,
      onend: function () {
        onHangupFinished();
      },
    });
    hangup.play();
    voiceSession?.stop();
    setStartRequested(false);
    // Release wake lock.
    release();
    track("call-ended", {
      conversationId: voiceSession?.conversationId || "",
    });
    const callDuration = callStartTime ? Date.now() - callStartTime : 0;
    track("call-duration", {
      duration: callDuration,
      conversationId: voiceSession?.conversationId || "",
    });
  }, [voiceSession, release, callStartTime, onHangupFinished]);

  // Invoked when the debug window is opened.
  const onDebugOpen = useCallback(() => {
    track("debug-menu-opened", {
      character: character.characterId,
    });
    setDebugSheetOpen(true);
  }, [character.characterId]);

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
  const onFeedback = useCallback(
    (good: boolean) => {
      console.log(
        `CallCharacter[${voiceSession?.conversationId}] - onFeedback: good ${good}`
      );
      track("call-feedback-received", {
        conversationId: voiceSession?.conversationId || "",
        callGood: good,
      });
    },
    [voiceSession]
  );

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
