'use client';
import React from 'react';
import { ActiveCallProps } from '@/lib/types';

const InterruptButton = ({ currentCharacter }: ActiveCallProps) => {
  function handleInterrupt(param: string) {
    console.log(`Interrupt clicked with parameter: ${param}`);
  }

  return (
    <div>
      <div onClick={() => handleInterrupt('Interrupting...')} className="button-group">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/637201f93e5c91dc8330c44c3a7193e0bcc7c0202785613592d0b331a8298e2f?apiKey=9c0baa37d70d4f66ac9c7050ad355a6f&"
          className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full"
        />
        <div className="text-slate-800 text-sm tracking-wide self-center grow whitespace-nowrap my-auto">
          Tap to interrupt
        </div>
      </div>
    </div>
  );
};

export default InterruptButton;
