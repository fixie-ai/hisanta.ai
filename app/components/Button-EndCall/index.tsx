"use client";
import React from 'react';
import { ActiveCallProps } from '@/lib/types';

const EndCallButton = ({ currentCharacter }: ActiveCallProps) => {
  function handleEndCall(param: string) {
    console.log(`End Call button clicked with parameter: ${param}`);
  }

  return (
    <div>
      <button onClick={() => handleEndCall('Ending Call...')}
        className="text-red-900 text-sm tracking-wide whitespace-nowrap justify-center items-center border bg-white self-stretch mt-4 px-16 py-5 rounded-3xl border-solid border-red-900 max-md:px-5"
        aria-label="End Call"
        aria-role="button"
      >
        End Call
      </button>
  </div>
  );
};

export default EndCallButton;