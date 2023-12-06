"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import config from '@/lib/config';
import { CharacterType } from '@/lib/types';
import PickerButtons from '../ButtonGroup-Picker';

const CharacterPicker = () => {
  const characters = config.availableCharacters;
  // default to Santa
  const santa = characters.find(c => c.characterId === 'santa');

  // handle state changes on the picker
  const [mainCharacter, setMainCharacter] = useState(santa);            // Handle main character
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null);     // Handle border color change on click
  const changeCharacter = (newCharacter: CharacterType) => {
    setMainCharacter(newCharacter);
    setSelectedCharacter(newCharacter);
  };

  // set selectedCharacter once santa is loaded
  useEffect(() => {
    if (santa) {
      setSelectedCharacter(santa);
    }
  }, [santa]);

  return (
    <div>
      {/* Card */}

      <div className="flex flex-col items-center  bg-White-75 align-middle rounded-xl py-2.5 px-3 h-[492px] w-[340px] text-center text-black text-sm border border-black items-center" >
        <div className="text-Holiday-Red text-xl">{mainCharacter?.name}</div>
        {/* Selected Character */}
        <div className="w-56 h-56">
          <Image src={`/images/${mainCharacter?.image}`} alt="Main" width={200} height={200} className="object-cover rounded-full" />
        </div>
        
        <div className="flex space-x-5 mt-6">
          {characters.map((character, index) => (
            <div key={index} onClick={() => changeCharacter(character)} className="w-[64px]">
              <Image
                src={`/images/${character.image}`}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className={`object-cover w-16 h-16 cursor-pointer items-center justify-center rounded-full ${character === selectedCharacter ? 'border-black border-4' : ''} `} />
            </div>
          ))}
        </div>
        {selectedCharacter ? (
          <PickerButtons currentCharacter={selectedCharacter} className="mt-12" />
        ) : (
          ""
        )}
        
      </div>
    </div>
  );
};

export default CharacterPicker;


