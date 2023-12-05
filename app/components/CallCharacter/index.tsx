"use client";
import { useState } from "react";
import { CharacterType } from "@/lib/types";
import ActiveCall from "../ActiveCall";
import StartNewCall from "../StartNewCall";

export function CallCharacter({ character }: { character: CharacterType }) {
  const [call, setCall] = useState<any>(null);
  return call !== null ? (
    <ActiveCall onCallEnd={() => setCall(null)} character={character} />
  ) : (
    <StartNewCall onCallStart={setCall} character={character} />
  );
}
