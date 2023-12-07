"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CharacterType } from "@/lib/types";
import EpicButton from "../Buttons";

const StartNewCall = ({
  character,
  onCallStart,
  startCallEnabled,
}: {
  character: CharacterType;
  onCallStart: () => void;
  startCallEnabled: boolean;
}) => {
  const onMakeCall = () => {
    console.log("Making call");
    onCallStart();
  };

  return (
    <div className="bg-White-75 rounded-jumbo border-black border flex flex-col mx-auto md:mt-4 gap-4 w-[340px] h-[600px] justify-between">
      <div className="mt-4 mx-auto text-3xl text-[#881425]">
        {character.name}
      </div>
      <div className="mx-auto">
        <Image
          className="drop-shadow-md"
          src={`/images/${character.image}`}
          alt={`${character.name} image`}
          width={200}
          height={2000}
        />
      </div>
      {/* 
      <div className="mx-auto font-['Inter-SemiBold']">
        Tell {character.name} your name (optional)
      </div>
      <div className="m-2">
        <input placeholder="Your name" className="w-full h-12 p-1 text-center px-4 mx-auto font-['Inter-Regular'] rounded-xl border-black border-2" />
      </div> */}
      <div className="m-4 h-1/5 flex flex-col justify-end">
        {startCallEnabled ? (
          <div className="w-full">
            <EpicButton
              disabled={!startCallEnabled}
              onClick={onMakeCall}
              type="primary"
              className="w-full"
            >
              Call {character.name}
            </EpicButton>
          </div>
        ) : (
          <div className="rounded-full align-middle justify-center w-full flex flex-row mx-auto border border-Holiday-Green p-4">
            <div className="text-lg color-Holiday-Green">
              Dialing {character.name}...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartNewCall;
