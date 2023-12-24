"use client";
import Link from 'next/link';
import { AuthButton } from '../Profile';
import { usePathname } from 'next/navigation';
import { useFlags } from 'launchdarkly-react-client-sdk';

export default function Header() {
  const pathname = usePathname();
  const { allowSignIn } = useFlags();

  return (
    <header className="flex flex-row justify-between items-center top-0 mt-4">
      <div className="self-center text-3xl pl-4 mt-2 md:pl-8">
        <Link href="/">
          <span className="text-Holiday-Green">Hi</span>
          <span className="text-Holiday-Red">Santa</span>
          <span>.ai</span>
        </Link>
      </div>
      <div className="ml-auto" />
      {pathname != '/profile' && allowSignIn && (
        <div className="mx-2">
          <AuthButton />
        </div>
      )}
    </header>
  );
}
