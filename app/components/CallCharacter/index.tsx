"use client";
import { useEffect, useRef, useState } from "react";
import { CharacterType } from "@/lib/types";
import ActiveCall from "../ActiveCall";
import StartNewCall from "../StartNewCall";
import useSound from "use-sound";
import { makeVoiceSession } from "../ActiveCall";
import { VoiceSession } from "fixie/src/voice";
import { set } from "lodash";

export function CallCharacter({ character }: { character: CharacterType }) {
  const [inCall, setInCall] = useState(false);
  const [numRings, setNumRings] = useState(0);
  const [stopRequested, setStopRequested] = useState(false);
  const [playRingtone, { stop }] = useSound(character.ringtone, {
    volume: 0.5,
    onend: () => {
      if (stopRequested) {
        setStopRequested(false);
        stop();
      }
    },
  });
  const [voiceSession, setVoiceSession] = useState<VoiceSession | null>(null);
  const [starting, setStarting] = useState(false);
  const cleanupPromiseRef = useRef<Promise<void>>();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [asrLatency, setAsrLatency] = useState(0);
  const [llmResponseLatency, setLlmResponseLatency] = useState(0);
  const [llmTokenLatency, setLlmTokenLatency] = useState(0);
  const [ttsLatency, setTtsLatency] = useState(0);

  useEffect(() => {
    let createdSession = false;
    if (!starting) {
      setStarting(true);

      const session = makeVoiceSession({
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
          // Stop ringtone.
          console.log("Stopping ringtone");
          stopRingtone();
        },
      });

      //setInput("");
      //setOutput("");
      //setAsrLatency(0);
      //setLlmResponseLatency(0);
      //setLlmTokenLatency(0);
      //setTtsLatency(0);

      createdSession = true;
      //console.log("[VoiceSession] doStart");
      //session.start();
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
  }, [voiceSession, starting]);

  const stopRingtone = () => {
    setStopRequested(true);
  };

  const onCallStart = (call: any) => {
    console.log(`CallCharacter: onCallStart - voiceSession is ${JSON.stringify(voiceSession)}`);
    voiceSession?.start();
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
      stopRingtone={stopRingtone}
      onCallEnd={onCallEnd}
      character={character}
    />
  ) : (
    <StartNewCall
      playRingtone={playRingtone}
      onCallStart={onCallStart}
      character={character}
    />
  );
}
