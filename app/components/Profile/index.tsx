'use client';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { CharacterType } from '@/lib/types';
import { datadogRum } from '@datadog/browser-rum';
import { PhoneIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

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
    datadogRum.addAction('login-button-clicked');
    signIn('auth0');
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

  const onClick = () => {
    datadogRum.addAction('logout-button-clicked', { user: session.user?.email });
    signOut();
  };

  return (
    <Button className="bg-Holiday-Blue w-full rounded-full" onClick={onClick}>
      Sign out
    </Button>
  );
}

function DeleteCharacterDialog({
  character,
  open,
  onOpenChange,
  doRefresh,
}: {
  character: CharacterType;
  open: boolean;
  onOpenChange: (val: boolean) => void;
  doRefresh: () => void;
}) {
  const onDelete = async () => {
    datadogRum.addAction('character-deleted', { characterId: character.characterId });
    const res = await fetch(`/api/character/${character.characterId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      console.log(`Got error deleting character ${character.characterId}: ${res.status} ${res.statusText}`);
    }
    doRefresh();
    onOpenChange(false);
  };
  const onCancel = () => {
    datadogRum.addAction('character-delete-canceled', { characterId: character.characterId });
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-Holiday-Green text-4xl text-center">
            <div className="overflow-hidden text-nowrap overflow-ellipsis">
              Delete <span className="text-Holiday-Red">{character.name}</span> ?
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="mx-auto w-full flex flex-col gap-4 mb-4">
            <div className="text-center flex flex-col w-full bg-slate-100 rounded-3xl font-[Inter-Regular] p-4 mb-4">
              <div className="text-base">Are you sure you want to delete this character?</div>
            </div>
            <div className="flex flex-row gap-4 justify-center">
              <Button className="bg-Holiday-Red rounded-full" onClick={onDelete}>
                <div className="text-sm">Delete</div>
              </Button>
              <Button className="bg-Holiday-Green rounded-full" onClick={onCancel}>
                <div className="text-sm">Cancel</div>
              </Button>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function CharacterCard({ characterId, doRefresh }: { characterId: string; doRefresh: () => void }) {
  console.log('characterId', characterId);

  const [characterObj, setCharacterObj] = useState<null | CharacterType>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    <>
      <div className="mx-2 rounded-2xl bg-slate-200 flex flex-row p-2 gap-4 justify-start items-center">
        <div className="rounded-full">
          <img
            src={characterObj.generatedImage ? characterObj.image : `/images/${characterObj.image}`}
            width={40}
            height={40}
            alt={characterObj.name}
          />
        </div>
        <div className="text-lg line-clamp-1 text-ellipsis">{characterObj.name}</div>
        <div className="ml-auto flex flex-row gap-1">
          <Link href={`/c/${characterId}`}>
            <Button className="bg-Holiday-Green rounded-full">
              <PhoneIcon className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <Button className="bg-Holiday-Red rounded-full" onClick={() => setDeleteDialogOpen(true)}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <DeleteCharacterDialog
        character={characterObj}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        doRefresh={doRefresh}
      />
    </>
  );
}

function SavedCharacters({ characterIds, doRefresh }: { characterIds: string[]; doRefresh: () => void }) {
  const { data: session } = useSession();
  datadogRum.addAction('saved-characters-viewed', { user: session?.user?.email });

  return (
    <>
      <div className="mt-4 mx-auto text-xl text-Holiday-Red text-center">Your Saved Characters</div>
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-2 w-full">
          {characterIds.map((id, index) => (
            <CharacterCard key={index} characterId={id} doRefresh={doRefresh} />
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
  datadogRum.addAction('join-invitation-viewed');

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
  datadogRum.addAction('profile-page-viewed', { user: session?.user?.email });
  const [refresh, setRefresh] = useState(false);

  const doRefresh = () => {
    setRefresh((prev) => !prev);
  };

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
  }, [refresh]);

  return (
    <div className="bg-slate-100 rounded-jumbo border border-black flex flex-col mx-auto md:mt-4 gap-4 w-[340px] h-[600px] justify-between">
      {session ? <SavedCharacters characterIds={characterIds} doRefresh={doRefresh} /> : <InvitationToJoin />}
    </div>
  );
}
