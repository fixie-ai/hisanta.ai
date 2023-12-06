"use client";
import React from 'react';
import { PickerButtonProps } from '@/lib/types';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const PickerButtons = ({ className, currentCharacter }: PickerButtonProps) => {

  function handleTalkToCharacter(param: string) {
    console.log(`Call button clicked with parameter: ${param}`);
  }

  return (
    <div className={`flex flex-row space-x-2 items-center ${className}`}>
      <div className="w-10 h-10 border border-Holiday-Green rounded-full flex items-center justify-center">
        <ChevronLeftIcon className="h-3 w-3 text-Holiday-Green" strokeWidth={4} />
      </div>
      <button
        onClick={() => handleTalkToCharacter(`Talk to ${currentCharacter.name}`)}
        className="border-Holiday-Green border rounded-3xl w-44 h-12 text-Holiday-Green text-sm tracking-wide justify-center items-center">
        Talk to {currentCharacter.name}
      </button>
      <div className="w-10 h-10 border border-Holiday-Green rounded-full flex items-center justify-center">
        <ChevronRightIcon className="h-3 w-3 text-Holiday-Green" strokeWidth={4} />
      </div>
  </div>
  );
};

export default PickerButtons;