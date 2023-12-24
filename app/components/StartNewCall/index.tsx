'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { CharacterType } from '@/lib/types';
import EpicButton from '../Buttons';
import { useRouter } from 'next/navigation';
import { ShareCharacter } from '../ShareCharacter';

const StartNewCall = ({
  character,
  onCallStart,
  startCallEnabled,
  onDebugOpen,
  showBio,
  shareButton,
}: {
  character: CharacterType;
  onCallStart: () => void;
  startCallEnabled: boolean;
  onDebugOpen: () => void;
  showBio?: boolean;
  shareButton?: boolean;
}) => {
  const router = useRouter();
  const [taps, setTaps] = useState(0);

  const onMakeCall = () => {
    console.log('Making call');
    onCallStart();
  };

  const handleTap = () => {
    setTaps(taps + 1);
    if (taps >= 4) {
      onDebugOpen();
      setTaps(0);
    }
  };

  const homeLink = character.bad ? '/?nice=0' : '/';

  return (
    <div className="bg-White-75 rounded-jumbo border-black border flex flex-col mx-auto md:mt-4 gap-2 w-[340px] h-[600px] justify-start">
      <div className="mt-4 mx-auto text-3xl text-[#881425] text-center">
        <p className="mx-4 line-clamp-2">{character.name}</p>
      </div>
      {showBio && (
        <div className="mx-2 text-center">
          <p className="line-clamp-3">{character.bio}</p>
        </div>
      )}
      <div className="mx-auto mt-4">
        {/* MDW: I don't understand why use of next-auth seems to prevent us from using <Image> here.
         * For some reason, <Image> complains that the Vercel blob URL is not configured in next.config.js,
         * when it is.
         */}
        <img
          className="drop-shadow-md"
          src={character.generatedImage ? character.image : `/images/${character.image}`}
          alt={`${character.name} image`}
          width={200}
          height={2000}
          onClick={handleTap}
        />
      </div>
      <div className="my-auto h-full" />
      <div className="mx-4 flex flex-col">
        {startCallEnabled ? (
          <div className="w-full">
            <EpicButton disabled={!startCallEnabled} onClick={onMakeCall} type="primary" className="w-full">
              <div className="overflow-hidden whitespace-nowrap overflow-ellipsis">Call {character.name}</div>
            </EpicButton>
          </div>
        ) : (
          <div className="w-full">
            <EpicButton disabled={true} onClick={onMakeCall} type="primary" className="w-full">
              <div className="overflow-hidden whitespace-nowrap overflow-ellipsis">Dialing {character.name}</div>
            </EpicButton>
          </div>
        )}
      </div>
      <div className="m-4 flex flex-col">
        {shareButton === true ? (
          <div className="w-full">
            <ShareCharacter character={character} />
          </div>
        ) : (
          <EpicButton onClick={() => router.push(homeLink)} type="secondaryGreen" className="w-full">
            Go back
          </EpicButton>
        )}
      </div>
    </div>
  );
};

export default StartNewCall;
