"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CharacterType } from "@/lib/types";
import { useSound } from "use-sound";

const StartNewCall = ({
  character,
  onCallStart,
}: {
  character: CharacterType;
  onCallStart: (call: any) => void;
}) => {
  const [ringtonePlaying, setRingtonePlaying] = useState(false);
  const [playRingtone, { stop }] = useSound(character.ringtone, {
    volume: 0.5,
    onend: () => {
      console.log("Ringtone ended");
      setRingtonePlaying(false);
      onCallStart({ callId: "call ID" });
    },
  });

  const onMakeCall = () => {
    console.log("Making call");
    onCallStart({ callId: "call ID" });

    //if (!ringtonePlaying) {
    //  setRingtonePlaying(true);
    //  playRingtone();
    //}
  };

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
          width={250}
          height={250}
        />
      </div>
      <div className="mx-auto font-['Inter-SemiBold']">
        Tell {character.name} your name (optional)
      </div>
      <div className="m-2">
        <input className="w-full h-12 p-1 text-center px-4 mx-auto font-['Inter-Regular'] rounded-xl border-black border-2" />
      </div>

      {ringtonePlaying ? (
        <button
          onClick={() => {
            stop();
            setRingtonePlaying(false);
          }}
          className="mt-1"
        >
          <div className="bg-white rounded-3xl align-middle text-[#881425] justify-center p-2 flex flex-row m-1 border-[#881425] border-2">
            <div className="text-lg mt-1">
              Calling {character.name}...
            </div>
          </div>
        </button>
      ) : (
        <button onClick={onMakeCall} className="mt-1">
          <div className="bg-[#0D5753] rounded-3xl align-middle text-white justify-center p-2 flex flex-row m-1 border-black border-2">
            <div className="text-lg mt-1">Call {character.name}</div>
          </div>
        </button>
      )}
    </div>
  );
};

export default StartNewCall;
