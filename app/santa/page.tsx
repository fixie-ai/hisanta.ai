import Image from 'next/image';
import CallSanta from '../components/CallSanta';
// import styles from '../globals.css';

export default function Page() {

  return (
    <div className="mx-20 flex flex-row justify-center">
      <div className="w-1/2 mt-60">
        <div className="flex flex-row space-x-3">
          <div className="bg-yellow-500 rounded-lg p-2 h-10 text-center text-black text-xl border-2 border-black">New!</div>
          <div className="bg-green-500 rounded-lg p-2 h-10 text-center text-black text-xl border-2 border-black">Exciting!</div>
          <div className="bg-red-300 rounded-lg p-2 h-10 text-center text-black text-xl border-2 border-black">Santa!</div>
        </div>
        <br />
        <h1 className="text-5xl">Talk to santa, Live from the North Pole!</h1>
        <div className="text-black font-['Inter-Regular']">Ready for a holiday surprise? Connect with Santa and share your Christmas wishes directly with the Jolliest man in the North Pole!</div>
        <CallSanta />
      </div>
      <div className="w-1/2 mt-36">
        <Image
          src="/images/santa-svg.svg"
          alt="Santa Image"
          width={550}
          height={550}
        />
      </div>
    </div>
    
  );
}