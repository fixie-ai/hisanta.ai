import Image from 'next/image';
import CallSantaButton from '../components/Button-CallSanta';
import CharacterPicker from '../components/CharacterPicker';
import Badges from '../components/Badges';

export default function Page() {

  return (
    <div className="mx-20 flex flex-row justify-center">
      <div className="w-1/2 mt-60">
        <Badges />
        <br />
        <h1 className="text-5xl">Talk to Santa & Friends, Live from the North Pole!</h1>
        <div className="text-black font-['Inter-Regular']">Ready for a holiday surprise? Connect with Santa and share your Christmas wishes directly with the Jolliest man in the North Pole!</div>
        <CallSantaButton />
      </div>
      <CharacterPicker />
    </div>
    
  );
}
