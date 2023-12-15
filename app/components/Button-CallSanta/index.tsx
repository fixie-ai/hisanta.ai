'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// This is not really a button.
const CallSantaButton = () => {
  return (
    <div className="bg-Light-Green rounded-full flex justify-between items-center w-[250px] md:w-[390px] h-[36px] md:h-[64px] mx-auto lg:mx-0 mt-2 md:mt-4">
      <div className="ml-2">
        <Image
          src="/images/santa-pc.png"
          alt="Santa Image"
          width={48}
          height={48}
          className="rounded-full w-[24px] h-[24px] md:w-[48px] md:h-[48px]"
        />
      </div>
      <div className="text-white justify-center p-2 flex flex-row m-1 items-center w-fit">
        <div className="text-xl md:text-3xl text-Holiday-Green mt-1 flex items-center">Powered by AI!</div>
      </div>
      <div className="mr-2">
        <Image
          src="/images/santa-calling.png"
          alt="Santa Image"
          width={48}
          height={48}
          className="rounded-full w-[24px] h-[24px] md:w-[48px] md:h-[48px]"
        />
      </div>
    </div>
  );
};

export default CallSantaButton;
