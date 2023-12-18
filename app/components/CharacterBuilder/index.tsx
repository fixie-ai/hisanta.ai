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
import { datadogRum } from '@datadog/browser-rum';
import { useFlags } from 'launchdarkly-react-client-sdk';

function LeftArrow({ onClick }: { onClick: () => void }) {
  return (
    <ChevronLeftIcon
      onClick={onClick}
      className="w-12 h-12 p-2 border-2 border-Holiday-Green rounded-full cursor-pointer"
    />
  );
}

function RightArrow({ onClick }: { onClick: () => void }) {
  return (
    <ChevronRightIcon
      onClick={onClick}
      className="w-12 h-12 p-2 border-2 border-Holiday-Green rounded-full cursor-pointer"
    />
  );
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
        priority={true}
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
  const { customCharactersEmptyBio } = useFlags();

  const [error, setError] = useState('');
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
    if (!userSetName && !customCharactersEmptyBio) {
      setName(characterTemplates[characterIndex].names[0]);
    }
  }, [characterIndex, userSetName, name]);

  useEffect(() => {
    if (!userSetDescription && !customCharactersEmptyBio) {
      setDescription(characterTemplates[characterIndex].bios[0]);
    }
  }, [characterIndex, userSetDescription, description]);

  useEffect(() => {
    if (!userSetGreeting && !customCharactersEmptyBio) {
      setGreeting(characterTemplates[characterIndex].greetings[0]);
    }
  }, [characterIndex, userSetGreeting, greeting]);

  useEffect(() => {
    setError('');
    if (!name) {
      setError('Please choose a name!');
      return;
    }
    if (!description) {
      setError('Please describe your character!');
      return;
    }
    if (!greeting) {
      setError('Please set a greeting!');
      return;
    }
  }, [name, description, greeting]);

  const onCreate = () => {
    const createRequest = {
      templateId: characterTemplates[characterIndex].templateId,
      name: name,
      bio: description,
      greeting: greeting.replace('{name}', name),
    };
    datadogRum.addAction('create-character', createRequest);

    fetch('/api/character', {
      method: 'POST',
      body: JSON.stringify(createRequest),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Created character: ', data);
        if (data.characterId) {
          router.push(`/c/${data.characterId}?share=true`);
        } else {
          setError('Error creating character: ' + data);
        }
      })
      .catch((err) => {
        datadogRum.addAction('create-character-error', {
          createRequest,
          error: err,
        });
        console.log('Error creating character: ', err);
        setError('Error creating character: ' + err);
      });
  };

  return (
    <div className="bg-White-75 rounded-jumbo border-black border flex flex-col mx-auto md:mt-4 gap-2 w-[340px] h-[600px] justify-start">
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Choose a character</div>
      <CharacterChooser onChoose={onChooseCharacter} />
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Name your character</div>
      <Input
        className="w-11/12 mx-auto font-[Inter-Regular]"
        placeholder="Name your character"
        maxLength={58}
        value={name}
        onInput={(e) => {
          setUserSetName(true);
          setName((e.target as HTMLInputElement).value);
        }}
      />
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Describe your character</div>
      <Textarea
        value={description}
        maxLength={4000}
        onInput={(e) => {
          setUserSetDescription(true);
          setDescription((e.target as HTMLTextAreaElement).value);
        }}
        className="w-11/12 mx-auto font-[Inter-Regular]"
        placeholder='For example: "You are a friendly, outgoing person who loves to spread holiday cheer. You are a great listener and love to hear about holiday traditions."'
      />
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Set greeting</div>
      <Input
        className="w-11/12 mx-auto font-[Inter-Regular]"
        placeholder='For example: "What up, dog? Merry Christmas!"'
        value={greeting.replace('{name}', name)}
        onInput={(e) => {
          setUserSetGreeting(true);
          setGreeting((e.target as HTMLInputElement).value);
        }}
      />
      <div className="mt-auto" />
      <div className="font-[Inter-Regular] text-center text-red-500 italic">{error}</div>
      <div className="m-4">
        <EpicButton disabled={error !== ''} type="primary" className="w-full" onClick={onCreate}>
          Create character
        </EpicButton>
      </div>
    </div>
  );
}
