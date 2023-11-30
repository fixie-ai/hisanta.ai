
import Image from 'next/image';
// import styles from '../globals.css';


export default function Page() {

  return (
    <div className="mx-20 flex flex-row justify-center">
      <div className="w-2/6 mt-60">
        <div className="flex flex-row space-x-3">
          <div className="bg-yellow-500 rounded-lg p-2 h-10 text-center text-black text-xl border-2 border-black">New!</div>
          <div className="bg-green-500 rounded-lg p-2 h-10 text-center text-black text-xl border-2 border-black">Exciting!</div>
          <div className="bg-red-300 rounded-lg p-2 h-10 text-center text-black text-xl border-2 border-black">Santa!</div>
        </div>
        <br />
        <h1 className="text-5xl">Talk to santa, Live from the North Pole!</h1>
        
        
        <div className="text-black font-['Inter-Regular']">Ready for a holiday surprise? Connect with Santa and share your Christmas wishes directly with the Jolliest man in the North Pole!</div>
        <div className="bg-white rounded-3xl border-black border-2 flex space-x-2 w-full">
          <div className="w-12 h-12 bg-gray-500 rounded-full border-2 border-black items-center justify-center m-2">
            <div className="m-1"><Image
              src="/images/santa-svg.svg"
              alt="Santa Image"
              width={40}
              height={40}
            /></div>
          </div>
          <div className="bg-green-900 rounded-3xl align-middle text-white justify-center w-80 p-2 flex flex-row m-1 w-10/12">
          
            <div className="mt-1">
              <Image
                src="/images/phone.svg"
                alt="Santa Image"
                width={20}
                height={600}
              />
            </div>
            <div className="text-lg mt-1">&nbsp;Call Santa Now</div>
          </div>
        </div>
      </div>
      <div className="w-1/2 mt-24">
        <Image
          src="/images/santa-svg.svg"
          alt="Santa Image"
          width={600}
          height={600}
        />
      </div>
    </div>
    
  );
}