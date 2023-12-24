'use client';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { CharacterType } from '@/lib/types';
import Image from 'next/image';

export function AuthButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <Link href="/profile">
        <Button className="bg-Holiday-Blue rounded-full">
          <div className="text-sm">Profile</div>
        </Button>
      </Link>
    );
  }
  return (
    <Link href="/profile">
      <Button className="bg-Holiday-Blue rounded-full">
        <div className="text-sm">Sign up or login</div>
      </Button>
    </Link>
  );
}

export function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return null;
  }

  const onClick = () => {
    signIn('auth0', { callbackUrl: 'http://localhost:3000/' });
  };

  return (
    <Button className="bg-Holiday-Green w-full rounded-full text-lg" onClick={onClick}>
      Sign in now
    </Button>
  );
}

export function LogoutButton() {
  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  return (
    <Button className="bg-Holiday-Blue w-full rounded-full" onClick={() => signOut()}>
      Sign out
    </Button>
  );
}

function CharacterCard({ characterId }: { characterId: string }) {
  console.log('characterId', characterId);

  const [characterObj, setCharacterObj] = useState<null | CharacterType>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      const res = await fetch(`/api/character/${characterId}`, {
        method: 'GET',
      });
      if (!res.ok) {
        console.log(`Got error fetching character ${characterId}: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setCharacterObj(data);
    };
    fetchCharacter();
  }, [characterId]);

  if (!characterObj) {
    return null;
  }

  console.log(`CharacterObj image is: ${characterObj.image}`);
  console.log(`CharacterObj generated is: ${characterObj.generatedImage}`);

  return (
    <div className="mx-2 rounded-2xl bg-slate-200 flex flex-row p-2 gap-4 justify-between items-center">
      <div className="rounded-full">
        <img
          src={characterObj.generatedImage ? characterObj.image : `/images/${characterObj.image}`}
          width={40}
          height={40}
          alt={characterObj.name}
        />
      </div>
      <div className="text-lg">{characterObj.name}</div>
      <div>
        <Link href={`/c/${characterId}`}>
          <Button className="bg-Holiday-Red rounded-full">
            <div className="text-sm">Call</div>
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SavedCharacters({ characterIds }: { characterIds: string[] }) {
  return (
    <>
      <div className="mt-4 mx-auto text-xl text-Holiday-Red text-center">Your Saved Characters</div>
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-2 w-full">
          {characterIds.map((id, index) => (
            <CharacterCard key={index} characterId={id} />
          ))}
        </div>
      </div>
      {/* <div className="my-auto h-full" /> */}
      <div className="my-4 mx-auto w-11/12">
        <LogoutButton />
      </div>
    </>
  );
}

function InvitationToJoin() {
  return (
    <>
      <div className="mt-4 mx-auto text-xl text-Holiday-Red text-center">Sign up or Login</div>
      <div className="font-[Inter-Regular] text-center text-xl text-black mx-auto w-11/12">
        Sign up or login to save your characters and access them from any device! It&apos;s free!
      </div>
      <div className="my-auto h-full" />
      <div className="my-4 mx-auto w-11/12">
        <LoginButton />
      </div>
    </>
  );
}

export function Profile() {
  const { data: session } = useSession();
  const [characterIds, setCharacterIds] = useState([]);

  useEffect(() => {
    const getCharIds = async () => {
      const res = await fetch(`/api/character`, {
        method: 'GET',
      });
      if (!res.ok) {
        console.log(`Got error fetching character list: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('fetched character ID list', data);
      setCharacterIds(data);
    };
    getCharIds();
  }, []);

  return (
    <div className="bg-slate-100 rounded-jumbo border border-black flex flex-col mx-auto md:mt-4 gap-4 w-[340px] h-[600px] justify-between">
      {session ? <SavedCharacters characterIds={characterIds} /> : <InvitationToJoin />}
    </div>
  );
}
