"use client";
import React from "react";
import Image from "next/image";
import { CharacterType } from "@/lib/types";

const StartNewCall = ({
  character,
  onCallStart,
}: {
  character: CharacterType;
  onCallStart: (call: any) => void;
}) => {
  return (
    <div className="bg-slate-100 rounded-3xl border-black border-4 flex flex-col w-full mt-4 gap-4">
      <div className="mt-4 mx-auto text-3xl text-[#881425]">
        {character.name}
      </div>
      <div className="mx-auto">
        <Image
          className="drop-shadow-md"
          src={`/images/${character.image}`}
          alt={`${character.name} image`}
          width={300}
          height={300}
        />
      </div>
      <div className="mx-auto font-['Inter-SemiBold']">
        Tell {character.name} your name (optional)
      </div>
      <div className="m-2">
        <input className="w-full h-12 p-1 text-center px-4 mx-auto font-['Inter-Regular'] rounded-xl border-black border-2" />
      </div>

      <button
        onClick={() => onCallStart({ callId: "call ID" })}
        className="mt-1"
      >
        <div className="bg-[#0D5753] rounded-3xl align-middle text-white justify-center p-2 flex flex-row m-1 border-black border-2">
          <div className="text-lg mt-1">Talk to {character.name}</div>
        </div>
      </button>
    </div>
  );
};

export default StartNewCall;
