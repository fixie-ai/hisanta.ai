'use client';
import React from 'react';
import { PickerButtonProps } from '@/lib/types';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import EpicButton from '../Buttons';
import Link from 'next/link';

const PickerButtons = ({ className, currentCharacter }: PickerButtonProps) => {
  return (
    <div className={`${className}`}>
      <Link href={`/${currentCharacter.characterId}`}>
        <EpicButton type="primary" className="w-[310px]">
          Talk to {currentCharacter.name}
        </EpicButton>
      </Link>
    </div>
  );
};

export default PickerButtons;
