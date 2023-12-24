'use client';
import Link from 'next/link';
import { NaughtyNiceSwitch } from '../NaughtyNiceSwitch';
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
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex flex-row">
              <span className="text-Holiday-Green">Hi</span>
              <span className="text-Holiday-Red">Santa</span>
              <span>.ai</span>
            </div>
            <div className="flex flex-row items-center -mt-2 md:mt-0">
              <span className="text-slate-500 font-[Inter-Regular] text-sm md:text-sm md:ml-2">by</span>
              <span className="text-black text-sm md:text-lg font-[Silkscreen-Regular] ml-2">ai.town</span>
            </div>
          </div>
        </Link>
      </div>
      <div className="ml-auto" />
      <div className="mx-2">
        <NaughtyNiceSwitch />
      </div>
      {pathname != '/profile' && allowSignIn && (
        <div className="mx-2">
          <AuthButton />
        </div>
      )}
    </header>
  );
}
