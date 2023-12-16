'use client';

import { notFound } from 'next/navigation';
import { CallCharacter } from '../../../components/CallCharacter';
import React, { useState, useEffect } from 'react';
import { CharacterType } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

// Set the runtime to Edge.
// @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
export const runtime = 'edge';

// Enable dynamic routes.
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
export const dynamicParams = true;

// Set the revalidation period.
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 60;

/**
 * The character page.
 */
export default function Page({ params }: { params: { character: string } }) {
  const searchParams = useSearchParams();
  const [characterObj, setCharacterObj] = useState<null | CharacterType>(null);
  const [err, setErr] = useState<null | string>(null);
  const shareButton = searchParams.get('share') === 'true' || false;

  useEffect(() => {
    console.log(`Character: ${params.character}`);
    const fetchCharacter = async () => {
      const res = await fetch(`/api/character/${params.character}`, {
        method: 'GET',
      });
      if (!res.ok) {
        console.log(`Got error fetching character ${params.character}: ${res.status} ${res.statusText}`);
        setErr(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setCharacterObj(data);
    };
    fetchCharacter();
  }, [params.character]);

  if (err) {
    notFound();
  }

  return (
    <div className="mx-auto flex flex-col w-full mt-4">
      {characterObj && <CallCharacter showBio shareButton={shareButton} character={characterObj} />}
    </div>
  );
}
