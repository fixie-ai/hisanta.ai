'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CharacterType } from '@/lib/types';
import ActiveCall from '../ActiveCall';
import StartNewCall from '../StartNewCall';
import { Howl } from 'howler';
import { FixieClient } from 'fixie';
import { VoiceSession, VoiceSessionError, VoiceSessionInit, VoiceSessionState } from 'fixie/src/voice';
import { DebugSheet } from '../DebugSheet';
import { CheckTooBusy } from '../CheckTooBusy';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { track as vercelTrack } from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useWakeLock } from 'react-screen-wake-lock';
import { CallFeedback } from '../CallFeedback';
import { datadogRum } from '@datadog/browser-rum';
import { CallError } from '../CallError';

const DEFAULT_ASR_PROVIDER = 'deepgram';
const DEFAULT_TTS_PROVIDER = 'eleven-ws';
const DEFAULT_LLM = 'gpt-4-1106-preview';

// Santa voice.
const DEFAULT_TTS_VOICE = 'Kp00queBTLslXxHCu1jq';

const LLM_MODELS = [
  'claude-2',
  'claude-instant-1',
  'gpt-4',
  'gpt-4-32k',
  'gpt-4-1106-preview',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
];

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
  webrtcUrl,
}: {
  agentId: string;
  asrProvider?: string;
  ttsProvider?: string;
  ttsVoice?: string;
  model?: string;
  webrtcUrl?: string;
}): VoiceSession {
  console.log(`[makeVoiceSession] creating voice session with LLM ${model}`);
  const fixieClient = new FixieClient({});
  const voiceInit: VoiceSessionInit = {
    webrtcUrl: webrtcUrl || 'wss://wsapi.fixie.ai',
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
export function CallCharacter({ character, showBio }: { character: CharacterType; showBio?: boolean }) {
  const searchParams = useSearchParams();
  const [inCall, setInCall] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [voiceSession, setVoiceSession] = useState<VoiceSession | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [startingCall, setStartingCall] = useState(false);
  const [startRequested, setStartRequested] = useState(false);
  const [debugSheetOpen, setDebugSheetOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [callError, setCallError] = useState('');

  const [stats, setStats] = useState<VoiceSessionStats>({
    state: null,
    asrLatency: -1,
    llmResponseLatency: -1,
    llmTokenLatency: -1,
    ttsLatency: -1,
  });
  const { llmModel } = useFlags();
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [callDuration, setCallDuration] = useState<number | null>(null);
  const router = useRouter();
  const model = searchParams.get('model') || llmModel;
  const noRing = searchParams.get('ring') == '0' || false;
  const webrtcUrl = searchParams.get('webrtcUrl');
  const { isSupported, released, request, release } = useWakeLock({
    onRequest: () => console.log('Screen wake lock requested'),
    onError: () => console.error('Error with wake lock'),
    onRelease: () => console.log('Screen wake lock released'),
  });

  useEffect(() => {
    setInCall(false);
    setVoiceSession(null);
    setStartingCall(false);
    setStartRequested(false);
    track('character-selected', {
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
      console.log(`CallCharacter[${voiceSession.conversationId}]: onRingtoneFinished - starting voice session`);
      voiceSession.start();
      setStartingCall(false);
      setInCall(true);
      setCallStartTime(Date.now());
      track('call-started', {
        character: character.characterId,
        conversationId: voiceSession.conversationId || '',
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
    track('call-start-requested', {
      character: character.characterId,
    });
    setStartingCall(true);
    // Request wake lock. `released` will be undefined here.
    if (isSupported) {
      request();
    }
    const session = makeVoiceSession({
      webrtcUrl: webrtcUrl || undefined,
      agentId: character.agentId,
      ttsVoice: character.voiceId,
      model: model,
    });

    session.onLatencyChange = (kind: string, latency: number) => {
      console.log(`CallCharacter[${session.conversationId}]: latency: ${kind} ${latency}`);
      switch (kind) {
        case 'asr':
          setStats((curStats) => ({
            ...curStats,
            asrLatency: latency,
            llmResponseLatency: 0,
            llmTokenLatency: 0,
            ttsLatency: 0,
          }));
          track('asr-latency-measured', {
            conversationId: session.conversationId || '',
            asrLatency: latency,
          });
          break;
        case 'llm':
          setStats((curStats) => ({
            ...curStats,
            llmResponseLatency: latency,
          }));
          track('llm-latency-measured', {
            conversationId: session.conversationId || '',
            llmLatency: latency,
          });
          break;
        case 'llmt':
          setStats((curStats) => ({
            ...curStats,
            llmTokenLatency: latency,
          }));
          track('llm-token-latency-measured', {
            conversationId: session.conversationId || '',
            llmTokenLatency: latency,
          });
          break;
        case 'tts':
          setStats((curStats) => ({
            ...curStats,
            ttsLatency: latency,
          }));
          track('tts-latency-measured', {
            conversationId: session.conversationId || '',
            ttsLatency: latency,
          });
          break;
      }
    };

    session.onStateChange = (state: VoiceSessionState) => {
      console.log(`CallCharacter[${session.conversationId}]: session state: ${state}`);
      if (state === VoiceSessionState.IDLE) {
        setRoomName(session.roomName || null);
      }
      setStats((curStats) => ({
        ...curStats,
        state,
        conversationId: session.conversationId || '',
      }));
      track('voice-session-state-changed', {
        conversationId: session.conversationId || '',
        state: state,
      });
    };
    session.onError = (err: VoiceSessionError) => {
      const msg = err.message;
      console.log(`CallCharacter[${session.conversationId}]: voiceSession error: ${msg}`);
      track('voice-session-error', {
        conversationId: session.conversationId || '',
        error: msg,
      });
      session.stop();
    };

    console.log(`CallCharacter: created voice session`);
    session.warmup();
    // This will prompt for mic permission.
    session
      .startAudio()
      .then(() => {
        // Starting audio session.
        setVoiceSession(session);
        if (noRing) {
          // Skip ringtone and get down to business.
          setStartRequested(true);
        } else {
          // Wait a beat before starting the ringtone, which feels more natural.
          setTimeout(() => {
            ringtone.play();
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(`CallCharacter: error starting audio session: ${err}`);
        setErrorDialogOpen(true);
        setCallError(err.message);
        setStartingCall(false);
      });
  }, [character, model, isSupported, request, ringtone, noRing, startingCall]);

  // Invoked when ringtone is done ringing.
  const onRingtoneFinished = () => {
    console.log(`CallCharacter: onRingtoneFinished`);
    // Wait a bit before starting the voice session, so the ringtone doesn't get cut off.
    setTimeout(() => {
      setStartRequested(true);
    }, 1000);
  };

  // Invoked when hangup sound effect is done playing.
  const onHangupFinished = useCallback(() => {
    console.log(`CallCharacter[${voiceSession?.conversationId}]: onHangupFinished`);
    setInCall(false);
    setFeedbackDialogOpen(true);
  }, [voiceSession]);

  // Called when user hangs up the call.
  const onCallEnd = useCallback(() => {
    console.log(`CallCharacter[${voiceSession?.conversationId}]: onCallEnd`);
    const hangup = new Howl({
      src: '/sounds/hangup.mp3',
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
    if (isSupported) {
      release();
    }
    track('call-ended', {
      conversationId: voiceSession?.conversationId || '',
    });
    const duration = callStartTime ? Date.now() - callStartTime : 0;
    setCallDuration(duration);
    track('call-duration', {
      duration,
      conversationId: voiceSession?.conversationId || '',
    });
  }, [voiceSession, isSupported, release, callStartTime, onHangupFinished]);

  // Invoked when the debug window is opened.
  const onDebugOpen = useCallback(() => {
    track('debug-menu-opened', {
      character: character.characterId,
    });
    setDebugSheetOpen(true);
  }, [character.characterId]);

  // Invoked when the debug submit button is clicked.
  const onDebugSubmit = (newCharacter?: string, newModel?: string) => {
    track('debug-menu-submitted', {
      character: newCharacter || 'unknown',
      model: model || 'unknown',
    });
    setDebugSheetOpen(false);
    if (newModel) {
      router.push(`/${newCharacter || character.characterId}?model=${newModel}`);
    } else {
      router.push(`/${newCharacter || character.characterId}`);
    }
  };

  // Invoked when user submits call feedback.
  const onFeedback = useCallback(
    ({ good, feedback, email }: { good?: boolean; feedback: string; email: string }) => {
      console.log(
        `CallCharacter[${voiceSession?.conversationId}] - onFeedback: good ${good} feedback ${feedback} email ${email}`
      );
      // We can send more parameters to DD than to Vercel.
      datadogRum.addAction('call-feedback-received', {
        conversationId: voiceSession?.conversationId || '',
        callGood: good ?? null,
        feedback: feedback,
        email: email,
      });
      vercelTrack('call-feedback-received', {
        conversationId: voiceSession?.conversationId || '',
        callGood: good ?? null,
      });
    },
    [voiceSession]
  );

  return (
    <CheckTooBusy>
      <CallError
        err={callError}
        open={errorDialogOpen}
        onOpenChange={() => {
          setErrorDialogOpen(false);
        }}
      />
      {inCall && voiceSession ? (
        <ActiveCall voiceSession={voiceSession} onCallEnd={onCallEnd} character={character} onDebugOpen={onDebugOpen} />
      ) : (
        <StartNewCall
          startCallEnabled={!startingCall}
          onCallStart={onCallStart}
          character={character}
          onDebugOpen={onDebugOpen}
          showBio={showBio}
        />
      )}
      <CallFeedback
        character={character}
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        onFeedback={onFeedback}
        duration={callDuration || undefined}
        conversationId={voiceSession?.conversationId}
        roomName={roomName || undefined}
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
