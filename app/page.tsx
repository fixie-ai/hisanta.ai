import CallSantaButton from "./components/Button-CallSanta";
import CharacterPicker from "./components/CharacterPicker";
import Badges from "./components/Badges";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col lg:flex-row pt-10">
        <div className="lg:w-2/3 mb-5 lg:mr-10 lg:mt-16">
          <Badges />
          <h1 className="text-[32px] leading-none mt-4 text-center lg:text-[40px] md:mx-20 lg:mx-0 px-1 md:pl-0 lg:text-left sm:mx-0">
            Talk to Santa & Friends, Live from the North Pole!
          </h1>
          <div className="text-black text-sm text-center font-['Inter-Regular'] px-4 md:pl-0 py-1 md:mx-20 lg:mx-0 lg:text-lg lg:text-left">
            Ready for a holiday surprise? Connect with Santa and share your
            Christmas wishes directly with the Jolliest man in the North Pole!
          </div>
          <CallSantaButton />
        </div>
        <div className="lg:w-1/3 flex justify-center">
          <CharacterPicker />
        </div>
      </div>
    </div>
  );
}
