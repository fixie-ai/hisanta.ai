'use client';
import React from 'react';
import { NameInputProps } from '@/lib/types';

const NameInput: React.FC<NameInputProps> = ({ inputValue, onChange }) => {
  return (
    <div>
      <div className="text-slate-700 text-xs font-semibold font-['Inter-SemiBold'] leading-5 whitespace-nowrap mt-4">
        Tell Santa your Name (optional)
      </div>
      <div className="flex flex-col items-center justify-center text-slate-400 font-['Inter-SemiBold'] text-center text-base leading-6 whitespace-nowrap border border-[color:var(--slate-800,#1E293B)] bg-white mt-1.5 px-10 py-4 rounded-xl border-solid max-md:px-5">
        <label htmlFor="name">Enter your name here</label>
        <input
          type="text"
          id="name"
          aria-label="Enter your name"
          role="textbox"
          value={inputValue}
          className="mt-2 px-2 py-1 w-full border rounded-md"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default NameInput;
