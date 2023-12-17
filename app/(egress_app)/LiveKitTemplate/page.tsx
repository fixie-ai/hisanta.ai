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

  const fetchCharacterIdFromAgentId = async (characterId: string) => {
    try {
      const res = await fetch(`/api/agentToCharacter/${characterId}`, {
        method: 'GET',
      });
      if (!res.ok) {
        throw new Error(`Error fetching character ${characterId}: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (error) {
      console.error(error);
      return null;  // Return null in case of an error
    }
  };
  

  function getCharacterByAgentIdLocal(agentId: string): CharacterType | null {
    const character_raw = config.availableCharacters.find((character) => character.agentId === agentId);
    if (character_raw) {
      return character_raw;
    } else {
      return null;
    }
  }

  function getCharacterByCharacterIdLocal(characterId: string): CharacterType | null {
    const character_raw = config.availableCharacters.find((character) => character.characterId === characterId);
    if (character_raw) {
      return character_raw;
    } else {
      return null;
    }
  }

  const searchParams = useSearchParams();

  const agentId = searchParams.get('agentId');

  let setCharacter: CharacterType = default_character;

  if (agentId) {
    // Check if the agentId is from one of the premade characters.
    let character = getCharacterByAgentIdLocal(agentId);
    if (character) {
      setCharacter = character;
    }
    else {
      // If not, retrieve the character Id from the agentId for custom built characters.
      fetchCharacterIdFromAgentId(agentId).then((characterId) => {
        if (characterId) {
          character = getCharacterByCharacterIdLocal(characterId);
          if (character) {
            setCharacter = character;
          }
        }
      })
    }
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
    <div
      className="bg-gray-300 flex justify-center items-center w-screen h-screen"
      style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover' }}
    >
      <div className="flex justify-center items-center w-2/3 h-2/3 mt-[-10%]">
        <Image
          className="object-contain max-w-full max-h-full"
          src={`/images/${setCharacter.image}`}
          alt={`${setCharacter.name} image`}
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


