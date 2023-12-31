import { useEffect } from 'react';
import { CharacterType } from '@/lib/types';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import EpicButton from '../Buttons';
import { CopyToClipboard } from '../CopyToClipboard';
import Link from 'next/link';
import Image from 'next/image';
import { datadogRum } from '@datadog/browser-rum';
import { ShareIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { LoginButton } from '../Profile';
import { useFlags } from 'launchdarkly-react-client-sdk';

export function ShareCharacter({ character }: { character: CharacterType }) {
  const { allowSignIn } = useFlags();
  const { data: session } = useSession();
  const shareUrl = `hisanta.ai/c/${character.characterId}`;
  const hasNativeShare = 'share' in navigator;

  useEffect(() => {
    // Save character to user profile, in case it hasn't been saved yet.
    const saveCharacter = async () => {
      const res = await fetch(`/api/character/${character.characterId}`, {
        method: 'POST',
      });
      if (!res.ok) {
        console.log(`Got error saving character ${character.characterId}: ${res.status} ${res.statusText}`);
      }
    };
    if (session && allowSignIn) {
      datadogRum.addAction('share-char-viewed', { user: session.user?.email });
      saveCharacter();
    }
  }, [character.characterId, session, allowSignIn]);

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className="w-full">
          <EpicButton type="secondaryGreen" className="w-full">
            <div className="overflow-hidden whitespace-nowrap overflow-ellipsis">Share {character.name}</div>
          </EpicButton>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-Holiday-Green text-4xl text-center">
            <div className="overflow-hidden text-nowrap overflow-ellipsis">
              Share <span className="text-Holiday-Red">{character.name}</span>
            </div>
          </DialogTitle>
          {session || !allowSignIn ? (
            <DialogDescription>
              <div className="mx-auto w-full flex flex-col gap-4 mb-4">
                <div className="text-center flex flex-col w-full bg-slate-100 rounded-3xl font-[Inter-Regular] p-4 mb-4">
                  <div className="text-sm">
                    Share this link with your friends and family to let them chat with {character.name}!
                  </div>
                  <div className="mt-4 text-base">
                    <CopyToClipboard value={`https://${shareUrl}`}>{shareUrl}</CopyToClipboard>
                  </div>
                </div>

                {hasNativeShare ? (
                  <EpicButton
                    type="secondaryGreen"
                    className="w-full"
                    onClick={() => {
                      datadogRum.addAction('share-char-native', { shareUrl });
                      navigator.share({
                        title: 'HiSanta.ai',
                        text: `I created a voice character named ${character.name} on HiSanta.ai! Check it out: https://${shareUrl}`,
                      });
                    }}
                  >
                    <div className="w-fit mx-auto flex flex-row gap-2 items-center">
                      <ShareIcon className="h-8 w-8" />
                      Share
                    </div>
                  </EpicButton>
                ) : (
                  <>
                    <Link href={`https://www.facebook.com/sharer/sharer.php?u=https://${shareUrl}`} target="_blank">
                      <EpicButton
                        type="secondaryGreen"
                        className="w-full"
                        onClick={() => {
                          datadogRum.addAction('share-char-to-facebook', { shareUrl });
                        }}
                      >
                        <div className="w-fit mx-auto flex flex-row gap-2 items-center">
                          <Image
                            src="/images/logo-facebook.svg"
                            alt="Facebook logo"
                            width={48}
                            height={48}
                            className="w-8 h-8"
                          />
                          Share on Facebook
                        </div>
                      </EpicButton>
                    </Link>
                    <Link
                      href={`https://twitter.com/intent/tweet?text=I just created a virtual character you can chat with on HiSanta.ai! Check it out: https://${shareUrl}`}
                      target="_blank"
                    >
                      <EpicButton
                        type="secondaryGreen"
                        className="w-full"
                        onClick={() => {
                          datadogRum.addAction('share-char-to-twitter', { shareUrl });
                        }}
                      >
                        <div className="w-fit mx-auto flex flex-row gap-2 items-center">
                          <Image
                            src="/images/logo-twitter.svg"
                            alt="Twitter logo"
                            width={48}
                            height={48}
                            className="w-8 h-8"
                          />
                          Share on Twitter
                        </div>
                      </EpicButton>
                    </Link>
                  </>
                )}
              </div>
            </DialogDescription>
          ) : (
            <DialogDescription>
              <div className="mx-auto w-full flex flex-col gap-4 mb-4">
                <div className="text-base font-[Inter-Regular]">
                  Please sign up or log in to save and share this character!
                </div>
                <LoginButton />
              </div>
            </DialogDescription>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
