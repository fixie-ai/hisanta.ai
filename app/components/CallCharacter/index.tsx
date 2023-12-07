"use client";
import { useEffect, useRef, useState } from "react";
import { CharacterType } from "@/lib/types";
import ActiveCall from "../ActiveCall";
import StartNewCall from "../StartNewCall";
import { makeVoiceSession } from "../ActiveCall";
import { VoiceSession } from "fixie/src/voice";
import {Howl, Howler} from 'howler';


export function CallCharacter({ character }: { character: CharacterType }) {
  const [inCall, setInCall] = useState(false);
  const [voiceSession, setVoiceSession] = useState<VoiceSession | null>(null);
  const [initialized, setInitialized] = useState(false);
  const cleanupPromiseRef = useRef<Promise<void>>();

  const ringtone = new Howl({
    src: [character.ringtone],
    preload: true,
    volume: 0.5,
    onend: function() {
      onRingtoneFinished();
    }
  });
  
  useEffect(() => {
    let createdSession = false;
    if (!initialized) {
      setInitialized(true);
      const session = makeVoiceSession({
        onInputChange: (text, final) => {},
        onOutputChange: (text, final) => {},
        onLatencyChange: (kind, latency) => {},
        onStateChange: (state) => {}
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

  const onCallStart = () => {
    console.log(`CallCharacter: onCallStart - voiceSession is ${JSON.stringify(voiceSession)}`);
    ringtone.play();
  };

  const onRingtoneFinished = () => {
    console.log(`CallCharacter: onRingtoneFinished - voiceSession is ${JSON.stringify(voiceSession)}`);
    if (!voiceSession) {
      console.error(`CallCharacter: onRingtoneFinished - voiceSession not yet initialized`);
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
