"use client";
import { useEffect, useRef, useState } from "react";
import { CharacterType } from "@/lib/types";
import ActiveCall from "../ActiveCall";
import StartNewCall from "../StartNewCall";
import useSound from "use-sound";
import { makeVoiceSession } from "../ActiveCall";
import { VoiceSession } from "fixie/src/voice";

export function CallCharacter({ character }: { character: CharacterType }) {
  const [inCall, setInCall] = useState(false);
  const [startRequested, setStartRequested] = useState(false);
  const [stopRequested, setStopRequested] = useState(false);
  // const [playRingtone, { stop }] = useSound(character.ringtone, {
  //   volume: 0.5,
  //   onend: () => {
  //     if (stopRequested) {
  //       setStopRequested(false);
  //       stop();
  //     }
  //   },
  // });
  const [voiceSession, setVoiceSession] = useState<VoiceSession | null>(null);
  const [initialized, setInitialized] = useState(false);
  const cleanupPromiseRef = useRef<Promise<void>>();

  useEffect(() => {
    let createdSession = false;
    if (!initialized) {
      setInitialized(true);
      const session = makeVoiceSession({
        onInputChange: (text, final) => {},
        onOutputChange: (text, final) => {},
        onLatencyChange: (kind, latency) => {},
        onStateChange: (state) => {
          // Stop ringtone.
          console.log("Stopping ringtone");
          stopRingtone();
        },
      });
      createdSession = true;
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
  }, [voiceSession, initialized]);

  const stopRingtone = () => {
    setStopRequested(true);
  };

  const onCallStart = () => {
    console.log(`CallCharacter: onCallStart - voiceSession is ${JSON.stringify(voiceSession)}`);
    if (!voiceSession) {
      console.error(`CallCharacter: onCallStart - voiceSession not yet initialized`);
      return;
    }
    voiceSession.start();
    setInCall(true);
  };

  const onCallEnd = () => {
    console.log(`CallCharacter: onCallEnd - voiceSession is ${JSON.stringify(voiceSession)}`);
    voiceSession?.stop();
    setInCall(false);
  }

  return (inCall && voiceSession) ? (
    <ActiveCall
      voiceSession={voiceSession}
      onCallEnd={onCallEnd}
      character={character}
    />
  ) : (
    <StartNewCall
      onCallStart={onCallStart}
      character={character}
    />
  );
}
