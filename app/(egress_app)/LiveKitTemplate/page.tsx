"use client";
import React, { useEffect, ReactElement } from "react";
import Image from "next/image";
import { CharacterType } from "@/lib/types";
import config from "@/lib/config";
import EgressHelper from '@livekit/egress-sdk'
import { Room } from 'livekit-client'
import { useSearchParams } from 'next/navigation'

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

  const agentId = searchParams.get("agentId")

  if (agentId) {
    character = getCharacterByAgentId(agentId);
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
    // <div className="bg-gray-300 rounded-jumbo flex flex-col w-screen h-screen justify-center items-center mx-auto">
    //   <div className="mx-auto mt-[-10%]"> {/* Adjust the percentage as needed */}
    //     <Image
    //       className="drop-shadow-md"
    //       src={`/images/${character.image}`}
    //       alt={`${character.name} image`}
    //       width={200}
    //       height={200}
    //     />
    //   </div>
    // </div>
    <div className="bg-gray-300 flex justify-center items-center w-screen h-screen">
  <div className="flex justify-center items-center w-2/3 h-2/3 mt-[-10%]"> {/* Adjust the negative margin as needed */}
    <Image
      className="object-contain max-w-full max-h-full"
      src={`/images/${character.image}`}
      alt={`${character.name} image`}
      width={400}  // Set the natural size of the image or a default value
      height={400} // Set the natural size of the image or a default value
      layout="responsive"
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
