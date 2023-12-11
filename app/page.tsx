"use client";

import React from "react";
import CharacterPicker from "./components/CharacterPicker";
import Badges from "./components/Badges";
import { CheckTooBusy } from "./components/CheckTooBusy";
import CallSantaButton from "./components/Button-CallSanta";

export default function Home() {
  return (
    <CheckTooBusy>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col lg:flex-row pt-4 md:pt-10">
          <div className="mt-0 lg:w-2/3 mb-2 md:mb-5 lg:mr-10 lg:mt-16">
            <div className="hidden md:block">
              <Badges />
            </div>
            <div className="block md:hidden text-[24px] leading-none md:mt-4 text-center lg:text-[40px] md:mx-20 lg:mx-0 px-1 md:pl-0 lg:text-left sm:mx-0">
              Talk to <span className="text-Holiday-Red">Santa</span> &{" "}
              <span className="text-Holiday-Green">Friends</span> like never
              before
            </div>
            <div className="hidden md:block text-[32px] leading-none md:mt-4 text-center lg:text-[40px] md:mx-20 lg:mx-0 px-1 md:pl-0 lg:text-left sm:mx-0">
              Talk to <span className="text-Holiday-Red">Santa</span> &{" "}
              <span className="text-Holiday-Green">Friends</span> like never
              before
            </div>
            <div className="hidden md:block text-black text-sm text-center font-['Inter-Regular'] px-4 md:pl-0 py-1 md:mx-20 lg:mx-0 lg:text-lg lg:text-left">
              Ready for a holiday surprise? Connect with Santa and share your
              Christmas wishes directly with the jolliest man at the North Pole!
            </div>
            <CallSantaButton />
          </div>
          <div className="lg:w-1/3 flex justify-center">
            <CharacterPicker />
          </div>
        </div>
      </div>
    </CheckTooBusy>
  );
}
