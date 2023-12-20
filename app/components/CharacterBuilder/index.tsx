'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { characterTemplates, characterVoices } from '@/lib/config';
import { CharacterTemplate, CharacterType, CharacterVoiceType } from '@/lib/types';
import EpicButton from '../Buttons';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon} from '@heroicons/react/24/outline';
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
    const newTemplates = customCharacter ? [...characterTemplates, customCharacter] : characterTemplates;
    setTemplates(newTemplates);
  }, [customCharacter]);

  useEffect(() => {
    if (customCharacter) {
      setCharacterIndex(templates.length - 1);
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

function VoiceChooserItem({ voice, index }: { voice: CharacterVoiceType, index: number }) {
  return (
    <div className="flex flex-col items-center justify-center h-2/3 bg-gray-200 rounded-2xl shadow-md max-w-md mx-auto mt-5 ">
      <div className="font-bold text-sm font-[Luckiest Guy] mt-2">VOICE #{index+1}</div>
      <div className="text-center text-xs mb-1 font-[Inter-SemiBold]">{voice.descriptor}</div>
      <div className="w-3/4 h-full p-3 bg-white rounded-lg overflow-hidden inline-flex justify-center items-center mb-2">
        <div className="w-5 h-5 relative">
          <PlayIcon style={{ fill: "#2F4665" }}/>
        </div>
        <div className="text-center text-[#2F4665] text-xs font-[Inter-Bold] break-words">Play sample</div>
      </div>    
    </div>


  );
}

function VoiceChooser({ onChoose, disabled }: { onChoose: (index: number) => void; disabled: boolean }) {
  const [voiceIndex, setVoiceIndex] = useState(0);

  const handleLeftClick = () => {
    setVoiceIndex((index) => {
      if (index == 0) {
        return characterVoices.length - 1;
      } else {
        return index - 1;
      }
    });
  };
  const handleRightClick = () => {
    setVoiceIndex((voiceIndex + 1) % characterVoices.length);
  };

  useEffect(() => {
    onChoose(voiceIndex);
  }, [voiceIndex, onChoose]);

  return (
    <div className="flex flex-row justify-between items-center w-full px-4">
      <LeftArrow onClick={handleLeftClick} disabled={disabled} />
      <div className="w-[170px]">
        <Carousel
          selectedItem={voiceIndex}
          showStatus={false}
          showIndicators={false}
          showThumbs={false}
          showArrows={false}
        >
          {characterVoices.map((voice, index) => (
            <VoiceChooserItem key={index} voice={voice} index={index}/>
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
  const [templates, setTemplates] = useState(characterTemplates);
  const [customImageBlob, setCustomImageBlob] = useState<string | null>(null);

  useEffect(() => {
    const newTemplates = customCharacter ? [...characterTemplates, customCharacter] : characterTemplates;
    setTemplates(newTemplates);
  }, [customCharacter]);

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
        blobToBase64(blob).then((base64) => {
          setCustomImageBlob(base64 as string);
        });
        setCustomCharacter({
          templateId: 'custom',
          names: ['name'],
          bios: ['description'],
          greetings: ['greeting'],
          image: imageURL, 
          voiceId: '',
          ringtone: '',
        });

        setIsGeneratingAvatar(false);
      })
      .catch((error) => {
        console.error('Error generating character image:', error);
        setIsGeneratingAvatar(false);
        setError('Error Generating Avatar');
      });
  };

  function blobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const onCreate = () => {

    const createRequest = {
      templateId: templates[characterIndex].templateId,
      name: name,
      bio: description,
      greeting: greeting.replace('{name}', name),
      voiceId: characterTemplates[voiceIndex].voiceId,
      ringtone: characterTemplates[voiceIndex].ringtone,
      customImage: customImageBlob,
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
      <VoiceChooser onChoose={onChooseVoice} disabled={isGeneratingAvatar}></VoiceChooser>
      <div className="mx-auto text-base text-Holiday-Red">Name your character</div>
      <Input
        className="w-11/12 mx-auto font-[Inter-Regular] border border-[#1E293B] rounded-lg"
        placeholder="Name your character"
        maxLength={58}
        value={name}
        onInput={(e) => {
          setUserSetName(true);
          setName((e.target as HTMLInputElement).value);
        }}
      />
      <div className="mt-4 mx-auto text-base text-Holiday-Red">Customize greeting</div>
      <Input
        className="w-11/12 mx-auto font-[Inter-Regular] border border-[#1E293B] rounded-lg"
        placeholder='For example: "What up, dog? Merry Christmas!"'
        value={greeting.replace('{name}', name)}
        onInput={(e) => {
          setUserSetGreeting(true);
          setGreeting((e.target as HTMLInputElement).value);
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
      
      <div className="font-[Inter-Regular] text-center text-red-500 italic">{error}</div>
      <div className="m-4">
        <EpicButton disabled={error !== '' || isGeneratingAvatar} type="primary" className="w-full" onClick={onCreate}>
          Create character
        </EpicButton>
      </div>
    </div>
  );
}
