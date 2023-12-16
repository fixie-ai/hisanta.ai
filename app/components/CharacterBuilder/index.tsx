'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { characterTemplates } from '@/lib/config';
import { CharacterTemplate } from '@/lib/types';
import EpicButton from '../Buttons';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function LeftArrow({ onClick }: { onClick: () => void }) {
  return <ChevronLeftIcon onClick={onClick} className="w-12 h-12 p-2 border-2 border-Holiday-Green rounded-full" />;
}

function RightArrow({ onClick }: { onClick: () => void }) {
  return <ChevronRightIcon onClick={onClick} className="w-12 h-12 p-2 border-2 border-Holiday-Green rounded-full" />;
}

function CharacterChooserItem({ character }: { character: CharacterTemplate }) {
  return (
    <div className="w-full">
      <Image
        className="drop-shadow-md"
        src={`/images/${character.image}`}
        alt={`${character.templateId} image`}
        width={300}
        height={300}
      />
    </div>
  );
}

function CharacterChooser({ onChoose }: { onChoose: (index: number) => void }) {
  const [characterIndex, setCharacterIndex] = useState(0);

  const handleLeftClick = () => {
    setCharacterIndex((index) => {
      if (index == 0) {
        return characterTemplates.length - 1;
      } else {
        return index - 1;
      }
    });
  };
  const handleRightClick = () => {
    setCharacterIndex((characterIndex + 1) % characterTemplates.length);
  };

  useEffect(() => {
    onChoose(characterIndex);
  }, [characterIndex, onChoose]);

  return (
    <div className="flex flex-row justify-between items-center w-full px-4">
      <LeftArrow onClick={handleLeftClick} />
      <div className="w-[100px]">
        <Carousel
          selectedItem={characterIndex}
          showStatus={false}
          showIndicators={false}
          showThumbs={false}
          showArrows={false}
        >
          {characterTemplates.map((character, index) => (
            <CharacterChooserItem key={index} character={character} />
          ))}
        </Carousel>
      </div>
      <RightArrow onClick={handleRightClick} />
    </div>
  );
}

export function CharacterBuilder() {
  const router = useRouter();
  const [testCallEnabled, setTestCallEnabled] = useState(false);

  const [name, setName] = useState('');
  const [userSetName, setUserSetName] = useState(false);
  const [description, setDescription] = useState('');
  const [userSetDescription, setUserSetDescription] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [userSetGreeting, setUserSetGreeting] = useState(false);
  const [characterIndex, setCharacterIndex] = useState(0);

  const onChooseCharacter = (index: number) => {
    setCharacterIndex(index);
  };

  useEffect(() => {
    if (!userSetName || name == '') {
      setName(characterTemplates[characterIndex].names[0]);
    }
  }, [characterIndex, userSetName, name]);

  useEffect(() => {
    if (!userSetDescription || description == '') {
      setDescription(characterTemplates[characterIndex].bios[0]);
    }
  }, [characterIndex, userSetDescription, description]);

  useEffect(() => {
    if (!userSetGreeting || greeting == '') {
      setGreeting(characterTemplates[characterIndex].greetings[0]);
    }
  }, [characterIndex, userSetGreeting, greeting]);

  const onCreate = () => {
    const createRequest = {
        templateId: characterTemplates[characterIndex].templateId,
        name: name,
        bio: description,
        greeting: greeting.replace('{name}', name)
    };
    fetch('/api/character', {
        method: 'POST',
        body: JSON.stringify(createRequest),
    }).then((res) => res.json())
    .then((data) => {
        console.log('Created character: ', data);
        router.push(`/c/${data.characterId}?share=true`);
    }
    ).catch((err) => {
        console.log('Error creating character: ', err);
    });
  };

  return (
    <div className="bg-White-75 rounded-jumbo border-black border flex flex-col mx-auto md:mt-4 gap-2 w-[340px] h-[600px] justify-start">
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Choose a character</div>
      <CharacterChooser onChoose={onChooseCharacter} />
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Name your character</div>
      <Input
        className="w-11/12 mx-auto font-[Inter-Regular]"
        placeholder="Name"
        value={name}
        onInput={(e) => {
          setUserSetName(true);
          setName((e.target as HTMLInputElement).value);
        }}
      />
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Describe your character</div>
      <Textarea
        value={description}
        onInput={(e) => {
          setUserSetDescription(true);
          setDescription((e.target as HTMLTextAreaElement).value);
        }}
        className="w-11/12 mx-auto font-[Inter-Regular]"
        placeholder="Describe your character"
      />
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Set greeting</div>
      <Input
        className="w-11/12 mx-auto font-[Inter-Regular]"
        placeholder="Set your character's greeting message"
        value={greeting.replace('{name}', name)}
        onInput={(e) => {
          setUserSetGreeting(true);
          setGreeting((e.target as HTMLInputElement).value);
        }}
      />
      <div className="mt-auto" />
      <div className="m-4">
        <EpicButton type="primary" className="w-full" onClick={onCreate} >
          Create character
        </EpicButton>
      </div>
    </div>
  );
}
