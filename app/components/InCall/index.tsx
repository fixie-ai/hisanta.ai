'use client';
import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { ActiveCallProps } from '@/lib/types';
import StartCallButton from '../Button-StartCall';
import InterruptButton from '../Button-Interrupt';
import EndCallButton from '../Button-EndCall';
import NameInput from '../Input-Name';

const InCall = ({ currentCharacter }: ActiveCallProps) => {
  const [name, setName] = useState('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`[InCall Component] Name changed to: ${event.target.value}`);
    setName(event.target.value);
  };

  return (
    <div>
      <div className="w-[275px] h-[493px] bg-red-200">
        <form
          onSubmit={(event) => event.preventDefault()}
          className="border border-[color:var(--slate-800,#1E293B)] shadow-xl bg-white bg-opacity-80 flex flex-col items-center px-4 py-5 rounded-[36px] border-solid"
        >
          <header className="text-red-900 text-center text-xl tracking-normal whitespace-nowrap">
            {currentCharacter.name}
          </header>
          <Image
            src={currentCharacter.generatedImage ? currentCharacter.image : `/images/${currentCharacter.image}`}
            alt={`${currentCharacter.name} Image.`}
            width={175}
            height={175}
            className="aspect-[0.85] object-contain object-center w-[170px] overflow-hidden max-w-full mt-7 rounded-full"
          />
          <NameInput inputValue={name} onChange={handleNameChange} />
          <StartCallButton currentCharacter={currentCharacter} />
          <InterruptButton currentCharacter={currentCharacter} />
          <EndCallButton currentCharacter={currentCharacter} />
        </form>
      </div>
    </div>
  );
};

export default InCall;
