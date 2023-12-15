"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import config from "@/lib/config";
import { CharacterType } from "@/lib/types";
import PickerButtons from "../ButtonGroup-Picker";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import EpicButton from "../Buttons";
import { set } from "lodash";

export default function CharacterPicker() {
  const searchParams = useSearchParams();
  const [buildOwn, setBuildOwn] = useState(false);

  let characters = config.availableCharacters;
  const showBad = searchParams.get("nice") == "0" || false;

  if (showBad) {
    characters = characters.filter((c) => c.bad === true);
  } else {
    characters = characters.filter((c) => c.bad !== true);
  }
  const santa = characters.find(
    (c) => c.characterId === "santa" || c.characterId === "badsanta"
  );

  const handleCreateClick = () => {
    setBuildOwn(true);
    setSelectedCharacter(null);
  };

  // handle state changes on the picker
  const [mainCharacter, setMainCharacter] = useState(santa); // Handle main character
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterType | null>(null); // Handle border color change on click
  const changeCharacter = (newCharacter: CharacterType) => {
    setMainCharacter(newCharacter);
    setSelectedCharacter(newCharacter);
    setBuildOwn(false);
  };

  // set selectedCharacter once santa is loaded
  useEffect(() => {
    if (santa) {
      setMainCharacter(santa);
      setSelectedCharacter(santa);
    }
  }, [santa, showBad]);

  return (
    <div>
      {/* Card */}

      <div className="flex flex-col bg-White-75 align-middle rounded-jumbo py-2.5 px-3 h-[492px] w-[340px] text-center text-black text-sm border border-black items-center overflow-x-hidden relative shadow-lg">
        <div className="text-Holiday-Red text-xl">{mainCharacter?.name}</div>
        {/* Selected Character */}
        <div className="flex justify-center mt-8">
          {buildOwn ? (
            <div className="p-4 bg-gray-300 rounded-full border-8 border-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[75px] h-[75px] p-2 cursor-pointer items-center justify-center rounded-full"
              >
                <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
              </svg>
            </div>
          ) : (
            <Image
              src={`/images/${mainCharacter?.image}`}
              alt="Main"
              width={125}
              height={125}
              className="drop-shadow-avatar"
            />
          )}
        </div>

        <div className="absolute bottom-[95px]">
          <div className="flex space-x-5 mt-12 justify-center">
            {characters.slice(0, 3).map((character, index) => (
              <div
                key={index}
                onClick={() => changeCharacter(character)}
                className="w-[64px]"
              >
                <Image
                  src={`/images/${character.image}`}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className={`object-cover w-16 h-16 p-2 shadow-lg cursor-pointer items-center justify-center rounded-full ${
                    character === selectedCharacter
                      ? "ring-Holiday-Green ring-4"
                      : "ring-2 ring-inset-2 ring-white"
                  } `}
                />
              </div>
            ))}
          </div>
          <div className="flex space-x-5 mt-4 justify-center">
            {characters.slice(3, 4).map((character, index) => (
              <div
                key={index}
                onClick={() => changeCharacter(character)}
                className="w-[64px]"
              >
                <Image
                  src={`/images/${character.image}`}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className={`object-cover w-16 h-16 p-2 shadow-lg cursor-pointer items-center justify-center rounded-full ${
                    character === selectedCharacter
                      ? "ring-Holiday-Green ring-4"
                      : "ring-2 ring-inset-2 ring-white"
                  } `}
                />
              </div>
            ))}
            <div onClick={() => handleCreateClick()} className="w-[64px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`object-cover w-16 h-16 p-2 shadow-lg cursor-pointer items-center justify-center rounded-full ${
                  buildOwn
                    ? "ring-Holiday-Green ring-4"
                    : "ring-2 ring-inset-2 ring-white"
                } `}
              >
                <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
              </svg>
            </div>
          </div>
        </div>
        {selectedCharacter ? (
          <PickerButtons
            currentCharacter={selectedCharacter}
            className="absolute bottom-4"
          />
        ) : (
          <div className="absolute bottom-4">
            <Link href={`/create`}>
              <EpicButton type="primary" className="w-[310px]">
                Build your own
              </EpicButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
