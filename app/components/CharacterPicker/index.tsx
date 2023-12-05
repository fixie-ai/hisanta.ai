"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import config from '@/lib/config';

const CharacterPicker = () => {
  const characters = config.availableCharacters;
  // default to Santa
  const santa = characters.find(c => c.characterId === 'santa');

  const [mainCharacter, setMainCharacter] = useState(santa?.image);

  const changeCharacter = (newCharacter: string) => {
    setMainCharacter(newCharacter);
  };

  return (
    <div>      
      <Image src={`/images/${mainCharacter}`} alt="Main" width={500} height={500} className="object-cover" />
      <div className="flex space-x-4 mt-4">
        {characters.map((character, index) => (
          <div key={index} onClick={() => changeCharacter(character.image)}>
            <Image src={`/images/${character.image}`} alt={`Thumbnail ${index + 1}`} width={100} height={100} className="object-cover cursor-pointer" />
            <p>{character.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterPicker;


