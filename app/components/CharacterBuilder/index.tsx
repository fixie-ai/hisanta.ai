'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { characterTemplates } from '@/lib/config';
import { CharacterTemplate, CharacterType } from '@/lib/types';
import EpicButton from '../Buttons';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { datadogRum } from '@datadog/browser-rum';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Skeleton } from '../ui/skeleton';
import { set } from 'lodash';

function LeftArrow({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };
  return (
    <ChevronLeftIcon
      aria-disabled={disabled}
      onClick={handleClick}
      className="w-12 h-12 p-2 border-2 border-Holiday-Green rounded-full cursor-pointer"
    />
  );
}

function RightArrow({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };
  return (
    <ChevronRightIcon
      aria-disabled={disabled}
      onClick={handleClick}
      className="w-12 h-12 p-2 border-2 border-Holiday-Green rounded-full cursor-pointer"
    />
  );
}

function CharacterChooserItem({
  character,
  isGeneratingAvatar,
}: {
  character: CharacterTemplate;
  isGeneratingAvatar: boolean;
}) {
  return (
    <div className="w-full">
      {isGeneratingAvatar ? (
        <Skeleton className="w-[100px] h-[100px] rounded-full bg-primary/10" />
      ) : (
        <Image
          className="drop-shadow-md"
          src={character.templateId === 'custom' ? character.image : `/images/${character.image}`}
          alt={`${character.templateId} image`}
          width={300}
          height={300}
          priority={true}
        />
      )}
    </div>
  );
}

function CharacterChooser({
  onChoose,
  customCharacter,
  disabled,
  isGeneratingAvatar,
}: {
  onChoose: (index: number) => void;
  customCharacter: CharacterTemplate | null;
  disabled: boolean;
  isGeneratingAvatar: boolean;
}) {
  const [characterIndex, setCharacterIndex] = useState(0);
  const [templates, setTemplates] = useState(characterTemplates);

  useEffect(() => {
    console.log('custom character changed', customCharacter);
    const newTemplates = customCharacter ? [...characterTemplates, customCharacter] : characterTemplates;
    setTemplates(newTemplates);
  }, [customCharacter]);

  useEffect(() => {
    if (customCharacter) {
      setCharacterIndex(templates.length - 1);
      console.log('new index', templates.length - 1);
    } else {
      setCharacterIndex(0);
    }
  }, [templates]);

  const handleLeftClick = () => {
    setCharacterIndex((prevIndex) => (prevIndex === 0 ? templates.length - 1 : prevIndex - 1));
  };

  const handleRightClick = () => {
    setCharacterIndex((prevIndex) => (prevIndex + 1) % templates.length);
  };

  useEffect(() => {
    onChoose(characterIndex);
  }, [characterIndex, onChoose]);

  return (
    <div className="flex flex-row justify-between items-center w-full px-4">
      <LeftArrow onClick={handleLeftClick} disabled={disabled} />
      <div className="w-[100px]">
        <Carousel
          selectedItem={characterIndex}
          showStatus={false}
          showIndicators={false}
          showThumbs={false}
          showArrows={false}
        >
          {templates.map((character, index) => (
            <CharacterChooserItem key={index} character={character} isGeneratingAvatar={isGeneratingAvatar} />
          ))}
        </Carousel>
      </div>
      <RightArrow onClick={handleRightClick} disabled={disabled} />
    </div>
  );
}

function VoiceChooserItem({ character }: { character: CharacterTemplate }) {
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

function VoiceChooser({ onChoose, disabled }: { onChoose: (index: number) => void; disabled: boolean }) {
  const [voiceIndex, setVoiceIndex] = useState(0);

  const handleLeftClick = () => {
    setVoiceIndex((index) => {
      if (index == 0) {
        return characterTemplates.length - 1;
      } else {
        return index - 1;
      }
    });
  };
  const handleRightClick = () => {
    setVoiceIndex((voiceIndex + 1) % characterTemplates.length);
  };

  useEffect(() => {
    onChoose(voiceIndex);
  }, [voiceIndex, onChoose]);

  return (
    <div className="flex flex-row justify-between items-center w-full px-4">
      <LeftArrow onClick={handleLeftClick} disabled={disabled} />
      <div className="w-[100px]">
        <Carousel
          selectedItem={voiceIndex}
          showStatus={false}
          showIndicators={false}
          showThumbs={false}
          showArrows={false}
        >
          {characterTemplates.map((character, index) => (
            <VoiceChooserItem key={index} character={character} />
          ))}
        </Carousel>
      </div>
      <RightArrow onClick={handleRightClick} disabled={disabled} />
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
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [customCharacter, setCustomCharacter] = useState<CharacterTemplate | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const onChooseCharacter = (index: number) => {
    setCharacterIndex(index);
  };

  const onChooseVoice = (index: number) => {
    setVoiceIndex(index);
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

  const onRegenerateAvatar = () => {
    if (!description) {
      setError('Please describe your character!');
      return;
    }
    console.log('generating avatar');
    setIsGeneratingAvatar(true);
    fetch('/api/generateCharacterImage', {
      method: 'POST',
      body: JSON.stringify({ characterDescription: description }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.blob(); // Get the response as a Blob
      })
      .then((blob) => {
        // Create a URL for the Blob
        const imageURL = URL.createObjectURL(blob);
        setCustomCharacter({
          templateId: 'custom',
          names: ['name'],
          bios: ['description'],
          greetings: ['greeting'],
          image: imageURL, // base64 encoded image
          voiceId: '',
          ringtone: '',
        });
        console.log('Generated character image URL: ', imageURL);
        console.log('generated character: ', customCharacter);

        setIsGeneratingAvatar(false);
      })
      .catch((error) => {
        console.error('Error generating character image:', error);
        setIsGeneratingAvatar(false);
        setError('Error Generating Avatar');
      });
  };

  const onCreate = () => {
    const createRequest = {
      templateId: characterTemplates[characterIndex].templateId,
      name: name,
      bio: description,
      greeting: greeting.replace('{name}', name),
    };
    datadogRum.addAction('create-character', { ...createRequest, emptyInitialBio: customCharactersEmptyBio });

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
    <div className="bg-White-75 rounded-jumbo border-black border flex flex-col mx-auto md:mt-4 gap-2 w-[340px] h-[600px] justify-start overflow-y-auto hide-scrollbar">
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Choose an avatar</div>
      <CharacterChooser
        onChoose={onChooseCharacter}
        customCharacter={customCharacter}
        disabled={isGeneratingAvatar}
        isGeneratingAvatar={isGeneratingAvatar}
      />
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
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Give your character a story</div>
      <div className="ml-4 mr-4 mx-auto font-[Inter-Light] text-sm font-thin">
        {' '}
        <span className="font-[Inter-Bold]">Dont skip this! </span>The background you create sets the stage for their
        personality, interests, and the way they interact with you.{' '}
      </div>

      <div className="bg-gray-200 rounded-xl p-1 flex-col justify-center items-center ml-4 mr-4">
        <Textarea
          value={description}
          maxLength={4000}
          onInput={(e) => {
            setUserSetDescription(true);
            setDescription((e.target as HTMLTextAreaElement).value);
          }}
          className="mx-auto font-[Inter-Regular] bg-white border border-[#1E293B] rounded-lg min-h-[120px]"
          placeholder='For example: "You are a friendly, outgoing person who loves to spread holiday cheer. You are a great listener and love to hear about holiday traditions."'
        />
        <button
          className="hover:bg-blue-200 tracking-normal leading-tight w-2/3 h-1/5 px-3 mb-4 mt-1 mx-auto bg-white font-[Inter-Bold] text-sm font-thin rounded-xl text-center text-gray-800 overflow-hidden flex items-center justify-center gap-1"
          onClick={onRegenerateAvatar}
          disabled={isGeneratingAvatar}
        >
          Regenerate Avatar
        </button>
      </div>
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Customize greeting</div>
      <Input
        className="w-11/12 mx-auto font-[Inter-Regular]"
        placeholder='For example: "What up, dog? Merry Christmas!"'
        value={greeting.replace('{name}', name)}
        onInput={(e) => {
          setUserSetGreeting(true);
          setGreeting((e.target as HTMLInputElement).value);
        }}
      />
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Choose a voice</div>
      <VoiceChooser onChoose={onChooseVoice} disabled={isGeneratingAvatar}></VoiceChooser>
      <div className="mt-auto" />
      <div className="font-[Inter-Regular] text-center text-red-500 italic">{error}</div>
      <div className="m-4">
        <EpicButton disabled={error !== '' || isGeneratingAvatar} type="primary" className="w-full" onClick={onCreate}>
          Create character
        </EpicButton>
      </div>
    </div>
  );
}
