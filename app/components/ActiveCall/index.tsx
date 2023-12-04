"use client";
import React from "react";
import Image from "next/image";
import { CharacterType } from "@/lib/types";
import { MicrophoneIcon, PhoneIcon } from "@heroicons/react/24/outline";

const ActiveCall = ({
  character,
  onCallEnd,
}: {
  character: CharacterType;
  onCallEnd: () => void;
}) => {
  return (
    <div className="bg-slate-100 rounded-3xl border-black border-4 flex flex-col w-full mt-4 gap-4">
      <div className="mt-4 mx-auto text-3xl text-[#881425]">
        {character.name}
      </div>
        <div className="mx-auto">
          <Image
            src={`/images/${character.image}`}
            alt="Santa Image"
            width={300}
            height={300}
          />
        </div>
        <button className="mt-1">
          <div>
            <div className="bg-white rounded-3xl align-middle justify-center items-center p-2 flex flex-row m-1">
              <MicrophoneIcon className="w-6 h-6" /><div className="text-lg mt-1">Tap to interrupt</div>
            </div>
          </div>
        </button>
        <button onClick={onCallEnd} className="mt-1">
            <div className="bg-white rounded-3xl align-middle text-[#881425] justify-center p-2 flex flex-row m-1 border-[#881425] border-2">
              <PhoneIcon className="w-6 h-6" />
              <div className="text-lg mt-1">&nbsp;End call</div>
            </div>
        </button>
    </div>
  );
};

export default ActiveCall;
