"use client";
import { useState } from "react";
import { CharacterType } from "@/lib/types";
import ActiveCall from "../ActiveCall";
import StartNewCall from "../StartNewCall";
import useSound from "use-sound";

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

  const stopRingtone = () => {
    setStopRequested(true);
  };

  return inCall ? (
    <ActiveCall
      stopRingtone={stopRingtone}
      onCallEnd={() => setInCall(false)}
      character={character}
    />
  ) : (
    <StartNewCall
      playRingtone={playRingtone}
      onCallStart={() => setInCall(true)}
      character={character}
    />
  );
}
