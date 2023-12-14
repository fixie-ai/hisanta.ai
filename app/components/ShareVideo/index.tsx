"use client";
import { useState } from "react";
import Image from "next/image";
import EpicButton from "../Buttons";
import config, { getCharacter } from "@/lib/config";
import { useRouter } from "next/navigation";


export function ShareVideo({ videoKey }: { videoKey: string }) {
    // XXX MDW - We need a way to know which character it is.
    const character = getCharacter("santa")!;

    const router = useRouter();
  
    return (
      <div className="bg-White-75 rounded-jumbo border-black border flex flex-col mx-auto md:mt-4 gap-2 w-[340px] h-[600px] justify-start">
        <div className="mt-4 mx-auto text-3xl text-[#881425]">
          Call with {character.name}
        </div>
        <div className="mx-auto mt-16">
          <Image
            className="drop-shadow-md"
            src={`/images/${character.image}`}
            alt={`${character.name} image`}
            width={200}
            height={2000}
          />
        </div>
        <div className="my-auto h-full" />
        <div className="mx-4 flex flex-col">
          {startCallEnabled ? (
            <div className="w-full">
              <EpicButton
                disabled={!startCallEnabled}
                onClick={onMakeCall}
                type="primary"
                className="w-full"
              >
                Call {character.name}
              </EpicButton>
            </div>
          ) : (
            <div className="rounded-full align-middle justify-center w-full flex flex-row mx-auto border border-Holiday-Green p-4">
              <div className="text-lg color-Holiday-Green">
                Dialing {character.name}...
              </div>
            </div>
          )}
        </div>
        <div className="m-4">
          <EpicButton
            type="secondaryGreen"
            className="w-full"
          >
            Play recording
          </EpicButton>
        </div>
      </div>
    );
  };
  