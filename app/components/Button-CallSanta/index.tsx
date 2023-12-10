"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const CallSantaButton = () => {
  return (
    <div className="mt-8 hidden lg:block">
      <div className="bg-Light-Green rounded-xl flex items-center w-[390px] h-[64px] mt-4 border border-black">
        <div className="ml-2">
          <Image
            src="/images/santa-pc.png"
            alt="Santa Image"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <div className="text-white justify-center p-2 flex flex-row m-1 w-10/12 items-center">
          <div className="text-2xl text-red text-Holiday-Green mt-1 flex items-center">
            Call Santa From the Web!
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallSantaButton;
