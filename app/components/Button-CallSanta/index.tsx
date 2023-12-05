"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const CallSantaButton = () => {
  return (
    <div>
      <div className="bg-Light-Green rounded-32 flex items-center w-[390px] h-[64px] mt-4">
        <div className="ml-2">
          <Image src="/images/santa-pc.png" alt="Santa Image" width={48} height={48} className="border-black border-solid border rounded-full" />
        </div>
        <div className="rounded-3xl text-white justify-center p-2 flex flex-row m-1 w-10/12 items-center">
          <div className="text-2xl text-red text-Holiday-Green">&nbsp;Call Santa From the Web!</div>
        </div>
      </div>
    </div>
  );
};

export default CallSantaButton;