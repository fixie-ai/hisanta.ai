"use client";
import React from 'react';
import Image from 'next/image';

const ActiveCall = ({ currentCharacter }) => {
  return (
    <div>
      <br />
      <h1 className="text-3xl">Live from {currentCharacter.location}</h1>
      <div className="bg-white rounded-3xl border-black border-2 flex flex-col w-full mt-4">
        
        {/* Character Image */}
        <div className="m-1">
          <Image src={`/images/${currentCharacter.image}`} alt="Santa Image" width={300} height={300} />
        </div>
        <div className="text=xl">{currentCharacter.name}</div>
        {/* Call Status */}
        <div>
          <div className="bg-slate-100 h-20  mx-3 rounded-lg align-middle text-white justify-center p-2 flex flex-row m-1 ">
              <div className="mt-1 flex items-center">
                <Image src="/images/dialing.svg" alt="Santa Image" width={20} height={600} />
              </div>
              <div className="text-sm mt-1 text-gray-800 font-['Inter-Regular'] flex items-center">&nbsp;Dialing...</div>
          </div>
        </div>
          
        {/* End Call Button */}
        <div>
          <div className="bg-red-600 rounded-3xl align-middle text-white justify-center p-2 flex flex-row m-1 border-black border-2">
            <div className="mt-1">
              <Image src="/images/phone.svg" alt="Santa Image" width={20} height={600} />
            </div>
            <div className="text-lg mt-1">&nbsp;End call</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveCall;