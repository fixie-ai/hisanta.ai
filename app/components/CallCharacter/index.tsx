"use client";
import { useState } from "react";
import { CharacterType } from "@/lib/types";
import ActiveCall from "../ActiveCall";
import StartNewCall from "../StartNewCall";

export function CallCharacter({ character }: { character: CharacterType }) {
  console.log(`CallCharacter: ${character.name} rendering`);
  const [inCall, setInCall] = useState(false);

  return inCall ? (
    <ActiveCall onCallEnd={() => setInCall(false)} character={character} />
  ) : (
    <StartNewCall onCallStart={() => setInCall(true)} character={character} />
  );
}
