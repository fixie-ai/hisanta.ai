"use client";
import React from "react";
import { PickerButtonProps } from "@/lib/types";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const PickerButtons = ({ className, currentCharacter }: PickerButtonProps) => {
  function handleTalkToCharacter(param: string) {
    console.log(`Call button clicked with parameter: ${param}`);
  }

  return (
    <div className={`flex flex-row space-x-2 items-center ${className}`}>
      <div className="w-10 h-10 border border-Holiday-Green rounded-full flex items-center justify-center">
        <ChevronLeftIcon
          className="h-3 w-3 text-Holiday-Green"
          strokeWidth={4}
        />
      </div>
      <Link href={`/${currentCharacter.characterId}`}>
        <button className="pushable">
          <span className="shadow"></span>
          <span className="edge"></span>
          <span className="front">Talk to {currentCharacter.name}</span>
        </button>
      </Link>
      <div className="w-10 h-10 border border-Holiday-Green rounded-full flex items-center justify-center">
        <ChevronRightIcon
          className="h-3 w-3 text-Holiday-Green"
          strokeWidth={4}
        />
      </div>
    </div>
  );
};

export default PickerButtons;
