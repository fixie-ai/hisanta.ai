'use client';
import React from 'react';
import { EpicButtonProps } from '@/lib/types';

const EpicButton = ({ children, type, className, disabled, onClick, isLoading }: EpicButtonProps) => {
  const buttonType = type || 'primary';
  const mappings = {
    primary: {
      front: 'bg-Holiday-Green text-white',
      edge: 'bg-Holiday-Green-Edge',
      shadow: 'Primary-Button-Shadow',
    },
    secondaryGreen: {
      front: 'bg-white shadow-Holiday-Green text-Holiday-Green',
      edge: 'bg-Holiday-Green',
      shadow: '',
    },
    secondaryRed: {
      front: 'bg-white shadow-Holiday-Red text-Holiday-Red',
      edge: 'bg-Holiday-Red',
      shadow: '',
    },
    disabled: {
      front: 'bg-white text-gray-500',
      edge: 'bg-gray-500',
      shadow: '',
    },
  };

  let frontClass = disabled ? mappings.disabled.front : mappings[buttonType].front;
  let edgeClass = disabled ? mappings.disabled.edge : mappings[buttonType].edge;
  let shadowClass = disabled ? mappings.disabled.shadow : mappings[buttonType].shadow;

  return (
    <button disabled={disabled || isLoading} onClick={onClick} className={`pushable ${className}`}>
      <span className={`shadow ${shadowClass}`}></span>
      <span className={`edge ${edgeClass}`}></span>
      <span className={`front ${frontClass}`} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        {isLoading ? (
          <svg className="animate-spin h-10 w-10 text-Holiday-Blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          children
        )}
      </span>
    </button>
  );
};

export default EpicButton;
