import CallSantaButton from "../components/Button-CallSanta";
import CharacterPicker from "../components/CharacterPicker";
import Badges from "../components/Badges";

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col md:flex-row pt-10">
        <div className="md:w-2/3 mb-5 md:mr-5">
          <Badges />
          <h1 className="text-[32px] leading-none mt-4 text-center sm:text-[40px] px-1 md:pl-0 sm:text-left sm:mx-0">
            Talk to Santa & Friends, Live from the North Pole!
          </h1>
          <div className="text-black text-sm text-center font-['Inter-Regular'] px-4 md:pl-0 py-1 md:text-lg md:text-left">
            Ready for a holiday surprise? Connect with Santa and share your
            Christmas wishes directly with the Jolliest man in the North Pole!
          </div>
          <CallSantaButton />
        </div>
        <div className="md:w-1/3 flex justify-center">
          <CharacterPicker />
        </div>
      </div>
    </div>
  );
}
