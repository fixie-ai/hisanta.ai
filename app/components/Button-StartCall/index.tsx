"use client";
import React from 'react';
import { ActiveCallProps } from '@/lib/types';

const StartCallButton = ({ currentCharacter }: ActiveCallProps) => {

  function handleTalkToSanta(param: string) {
    console.log(`Call button clicked with parameter: ${param}`);
  }

  function handleCallMe(param: string) {
    console.log(`TalkToMe button clicked with parameter: ${param}`);
  }

  return (
    <div>
      <button onClick={() => handleTalkToSanta('Talk To Santa')} className="text-white text-sm tracking-wide whitespace-nowrap justify-center items-center border border-[color:var(--black,#000)] bg-teal-800 self-stretch mt-4 px-16 py-5 rounded-3xl border-solid max-md:px-5">
        Talk to Santa
      </button>
      <a onClick={() => handleCallMe('Call Me!')}
        href="tel:1234567890"
        className="text-teal-800 text-sm tracking-wide whitespace-nowrap justify-center items-center border border-[color:var(--black,#000)] bg-white self-stretch mt-4 px-16 py-5 rounded-3xl border-solid max-md:px-5"
      >
        Call my phone
      </a>
  </div>
  );
};

export default StartCallButton;