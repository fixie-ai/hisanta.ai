'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

function AuthButton() {
  const { data: session } = useSession();

  console.log('MDW AUTHBUTTON - session', session);

  if (session) {
    return (
      <>
        {session?.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export function Profile() {
  return (
    <div>
      <AuthButton />
    </div>
  );
}
