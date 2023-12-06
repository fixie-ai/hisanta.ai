import Image from 'next/image';
import CallSantaButton from '../components/Button-CallSanta';
import CharacterPicker from '../components/CharacterPicker';
import Badges from '../components/Badges';

export default function Page() {

  return (
    <div className="flex flex-col justify-center sm:justify-normal sm:ml-28 xl:flex-row">
      <div className="w-[530px]">
        <Badges />
        <h1 className="text-[32px] leading-none mt-4 text-center sm:text-[40px] sm:text-left sm:mx-0">Talk to Santa & Friends, Live from the North Pole!</h1>
        <div className="text-black text-sm text-center font-['Inter-Regular'] sm:w-[490px] sm:text-lg sm:text-left">Ready for a holiday surprise? Connect with Santa and share your Christmas wishes directly with the Jolliest man in the North Pole!</div>
        <CallSantaButton />
      </div>
      <CharacterPicker />
    </div>
    
  );
}
