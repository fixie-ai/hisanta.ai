import { CharacterType } from '@/lib/types';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import EpicButton from '../Buttons';
import { CopyToClipboard } from '../CopyToClipboard';
import Link from 'next/link';
import Image from 'next/image';
import { datadogRum } from '@datadog/browser-rum';

export function ShareCharacter({ character }: { character: CharacterType }) {
  const shareUrl = `hisanta.ai/c/${character.characterId}`;
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
          <DialogDescription>
            <div className="mx-auto w-full flex flex-col gap-4 mb-4">
              <div className="text-center flex flex-col w-full bg-slate-100 rounded-3xl font-[Inter-Regular] p-4 mb-4">
                <div className="mt-4 text-base">
                  <CopyToClipboard value={`https://${shareUrl}`}>{shareUrl}</CopyToClipboard>
                </div>
              </div>
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
              <EpicButton className="w-full h-12">Close</EpicButton>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
