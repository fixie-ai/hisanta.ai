"use client";
import React, { useEffect, ReactElement } from "react";
import Image from "next/image";
import { CharacterType } from "@/lib/types";
import config from "@/lib/config";
import EgressHelper from '@livekit/egress-sdk'
import { Room } from 'livekit-client'
  
const default_character: CharacterType = {
  characterId: "santa",
  name: "Santa",
  image: "santa-hdpi.png",
  bio: "It's Santa.",
  location: "The North Pole",
  ringtone: "/sounds/jinglebells.mp3",
  agentId: "5d37e2c5-1e96-4c48-b3f1-98ac08d40b9a",
  voiceId: "Kp00queBTLslXxHCu1jq",
};

// const EgressTemplate = ({
//   character
// }: {character?: CharacterType}) => {

const EgressTemplate = () => {

  const character = default_character;

  function getCharacterByAgentId(agentId: string): CharacterType {
    const character_raw = config.availableCharacters.find((character) => character.agentId === agentId);
    if (character_raw) {
      return character_raw;
    } else {
      return default_character;
    }
  }


  useEffect(() => {
    const newRoom = new Room({ adaptiveStream: true });
    EgressHelper.setRoom(newRoom, { autoEnd: true });

    EgressHelper.onLayoutChanged((layout) => {
        // Implement layout change logic if necessary
    });

    const connectRoom = async () => {
        try {
            await newRoom.connect(
                EgressHelper.getLiveKitURL(),
                EgressHelper.getAccessToken(),
            );
            EgressHelper.startRecording();
        } catch (error) {
            console.error("Failed to connect:", error);
            // Handle connection errors here
        }
    };

    connectRoom();
      
  }, []);
    

  return (
    <div className="bg-gray-300 rounded-jumbo flex flex-col mx-auto md:mt-4 gap-2 w-[450px] h-[350px] justify-start">
      <div className="mx-auto mt-8">
        <Image
          className="drop-shadow-md"
          src={`/images/${character.image}`}
          alt={`${character.name} image`}
          width={200}
          height={200}
        />
      </div>
    </div>
  );
};

EgressTemplate.getLayout = function getLayout(page: ReactElement) {
    return (
        <>{page}</>
    )
}

export default EgressTemplate;
