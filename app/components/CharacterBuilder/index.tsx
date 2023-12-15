'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { characterTemplates } from '@/lib/config';
import EpicButton from '../Buttons';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ChevronRight } from 'lucide-react';

function LeftArrow({ onClick } : { onClick: () => void }) {
  return <ChevronLeftIcon onClick={onClick} className="w-8 h-8 p-2 border border-Holiday-Green rounded-full" />;
}

function RightArrow({ onClick } : { onClick: () => void }) {
  return <ChevronRightIcon onClick={onClick} className="w-8 h-8 p-2 border border-Holiday-Green rounded-full" />;
}

function CharacterChooserItem({ character }) {
  return (
    <div className="w-[100px] mx-auto border border-green-500">
      <Image
        className="drop-shadow-md"
        src={`/images/${character.image}`}
        alt={`${character.templateId} image`}
        width={100}
        height={100}
      />
    </div>
  );
}

function CharacterChooser() {
    const [characterIndex, setCharacterIndex] = useState(0);

  const handleLeftClick = () => {
    setCharacterIndex((characterIndex - 1) % characterTemplates.length);
  }
  const handleRightClick = () => {
    setCharacterIndex((characterIndex + 1) % characterTemplates.length);
  }

  return (
    <div className="flex flex-row justify-between w-full border border-red-500">
        <LeftArrow onClick={handleLeftClick} />
      <Carousel
        selectedItem={characterIndex}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        showArrows={false}
        infiniteLoop={true}
      >
        {characterTemplates.map((character, index) => (
          <CharacterChooserItem key={index} character={character} />
        ))}
      </Carousel>
      <RightArrow onClick={handleRightClick} />
    </div>
  );
}

export function CharacterBuilder() {
  const [testCallEnabled, setTestCallEnabled] = useState(false);

  const onMakeTestCall = () => {};

  return (
    <div className="bg-White-75 rounded-jumbo border-black border flex flex-col mx-auto md:mt-4 gap-2 w-[340px] h-[600px] justify-start">
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Choose a character</div>
      <CharacterChooser />
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Name your character</div>
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Describe your character</div>
      <div className="m-4">
        <EpicButton disabled={!testCallEnabled} onClick={onMakeTestCall} type="secondaryGreen" className="w-full">
          Make a test call
        </EpicButton>
      </div>
      <div className="m-4">
        <EpicButton type="primary" className="w-full">
          Create character
        </EpicButton>
      </div>
    </div>
  );
}
