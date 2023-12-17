'use client';
import React, { useEffect, useState, ReactElement } from 'react';
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
  const [character, setCharacter] = useState(default_character);
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(true);
  const [isConnectingRoom, setIsConnectingRoom] = useState(true);
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agentId');

  const fetchCharacterIdFromAgentId = async (agentId: string) => {
    try {
      const res = await fetch(`/api/agentToCharacter/${agentId}`, {
        method: 'GET',
      });
      if (!res.ok) {
        throw new Error(`Error fetching character from agent Id ${agentId}: ${res.status} ${res.statusText}`);
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

  useEffect(() => {
    const loadCharacterData = async () => {
      if (agentId) {
        const localCharacter = getCharacterByAgentIdLocal(agentId);
        if (localCharacter) {
          setCharacter(localCharacter);
        } else {
          const characterId = await fetchCharacterIdFromAgentId(agentId);
          if (characterId) {
            const fetchedCharacter = getCharacterByCharacterIdLocal(characterId);
            if (fetchedCharacter) {
              setCharacter(fetchedCharacter);
            }
          }
        }
      }
      setIsLoadingCharacter(false);
    };

    loadCharacterData();
  }, [agentId]);

  useEffect(() => {
    const newRoom = new Room({ adaptiveStream: true });
    newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      if (track.kind === Track.Kind.Audio || track.kind === Track.Kind.Video) {
        const element = track.attach();
        document.body.appendChild(element);
      }
    });

    EgressHelper.setRoom(newRoom, { autoEnd: true });

    const connectRoom = async () => {
      try {
        await newRoom.connect(EgressHelper.getLiveKitURL(), EgressHelper.getAccessToken());
        setIsConnectingRoom(false);
      } catch (error) {
        console.error('Failed to connect:', error);
      }
    };
    connectRoom();
  }, []); 

  useEffect(() => {
    if (!isLoadingCharacter && !isConnectingRoom) {
      EgressHelper.startRecording();
    }
  }, [isLoadingCharacter, isConnectingRoom]);

  if (isLoadingCharacter) {
    return <div>Loading Character...</div>;
  }

  const backgroundImageUrl = `/images/recording-background.png`;
  return (
    <div className="bg-gray-300 flex justify-center items-center w-screen h-screen"
         style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover' }}>
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
