"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const CallSanta = () => {
  return (
    <div className="bg-white rounded-3xl border-black border-2 flex space-x-2 w-full mt-4">
      <div className="w-12 h-12 bg-gray-500 rounded-full border-2 border-black items-center justify-center m-2">
        <div className="m-1">
          <Image src="/images/santa-svg.svg" alt="Santa Image" width={40} height={40} /></div>
      </div>
      <div className="bg-green-900 rounded-3xl align-middle text-white justify-center p-2 flex flex-row m-1 w-10/12">
        <div className="mt-1">
          <Image src="/images/phone.svg" alt="Santa Image" width={20} height={600} />
        </div>
        <div className="text-lg mt-1">&nbsp;Call Santa Now</div>
      </div>
    </div>
    
  );
};

export default CallSanta;