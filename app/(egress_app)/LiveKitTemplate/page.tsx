'use client';
import React, { useEffect, ReactElement } from 'react';
import Image from 'next/image';
import { CharacterType } from '@/lib/types';
import config from '@/lib/config';
import EgressHelper from '@livekit/egress-sdk';
import {
  Room,
  RoomEvent,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteParticipant,
  Track,
  Participant,
} from 'livekit-client';
import { useSearchParams } from 'next/navigation';

const default_character: CharacterType = {
  characterId: 'santa',
  name: 'Santa',
  image: 'santa-hdpi.png',
  bio: "It's Santa.",
  location: 'The North Pole',
  ringtone: '/sounds/jinglebells.mp3',
  agentId: '5d37e2c5-1e96-4c48-b3f1-98ac08d40b9a',
  voiceId: 'Kp00queBTLslXxHCu1jq',
};

const EgressTemplate = () => {
  function getCharacterByAgentId(agentId: string): CharacterType {
    const character_raw = config.availableCharacters.find((character) => character.agentId === agentId);
    if (character_raw) {
      return character_raw;
    } else {
      return default_character;
    }
  }

  let character = default_character;
  const searchParams = useSearchParams();

  const agentId = searchParams.get('agentId');

  if (agentId) {
    character = getCharacterByAgentId(agentId);
  }

  useEffect(() => {
    function handleTrackSubscribed(
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant
    ) {
      if (track.kind === Track.Kind.Audio || track.kind === Track.Kind.Video) {
        const element = track.attach();
        document.body.appendChild(element);
      }
    }

    const newRoom = new Room({ adaptiveStream: true });
    newRoom.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

    EgressHelper.setRoom(newRoom, { autoEnd: true });

    const connectRoom = async () => {
      try {
        await newRoom.connect(EgressHelper.getLiveKitURL(), EgressHelper.getAccessToken());
        EgressHelper.startRecording();
      } catch (error) {
        console.error('Failed to connect:', error);
        // Handle connection errors here
      }
    };

    connectRoom();
  }, []);

  const backgroundImageUrl = `/images/recording-background.png`;
  return (
    <div className="bg-gray-300 flex justify-center items-center w-screen h-screen"
        style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover' }}
    >
      <div className="flex justify-center items-center w-2/3 h-2/3 mt-[-10%]">
        <Image
          className="object-contain max-w-full max-h-full"
          src={`/images/${character.image}`}
          alt={`${character.name} image`}
          width={400}
          height={400}
          layout="responsive"
        />
      </div>
    </div>
  );
};

EgressTemplate.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default EgressTemplate;
