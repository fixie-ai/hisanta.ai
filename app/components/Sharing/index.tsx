import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import EpicButton from "../Buttons";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { Uuid } from "uuid-tool";
import base from "base-x";
import { CopyToClipboard } from "../CopyToClipboard";
import { datadogRum } from "@datadog/browser-rum";
import Link from "next/link";
import { CharacterType } from "@/lib/types";

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const b58 = base(BASE58);

/** Given a UUID string, returns the short key to access it via the sharing page. */
export function shareKey(uuid: string) {
  const uuidObj = new Uuid(uuid);
  return b58.encode(uuidObj.toBytes().slice(0, 6));
}

/** Checkbox allowing user to select whether they want to share their call. */
export function ShareCheckbox({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
}) {
  return (
    <div className="flex flex-row gap-4 border rounded-2xl p-4 items-center">
      <Checkbox
        className="w-8 h-8"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <div className="text-Holiday-Green text-xl text-left">
        Generate a shareable recording of your call
      </div>
    </div>
  );
}

/** Returns dialog content for the sharing action. */
export function SharingDialogContent({
  roomId,
  onClose,
  duration,
  character,
}: {
  roomId: string;
  onClose: () => void;
  duration?: number;
  character: CharacterType;
}) {
  // Duration is in milliseconds. We need minutes and seconds.
  const minutes = duration ? Math.floor(duration! / 60000) : "0";
  const seconds = duration ? ((duration! % 60000) / 1000).toFixed(0) : 0;
  const shareUrl = `hisanta.ai/${shareKey(roomId)}`;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-Holiday-Blue text-4xl text-center">
          Share your call!
        </DialogTitle>
        <DialogDescription>
          <div className="mx-auto w-full flex flex-col gap-4 mb-4">
            <div className="text-center flex flex-col w-full bg-slate-100 rounded-3xl font-[Inter-Regular] p-4 mb-4">
              <div className="text-sm">
                Your {minutes}:{seconds.toString().padStart(2, "0")} call can be
                replayed here:
              </div>
              <div className="mt-4 text-xl">
                <CopyToClipboard value={`https://${shareUrl}`}>
                  {shareUrl}
                </CopyToClipboard>
              </div>
            </div>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=https://${shareUrl}`}
              target="_blank"
            >
              <EpicButton
                type="secondaryGreen"
                className="w-full"
                onClick={onClose}
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
              href={`https://twitter.com/intent/tweet?text=I just had a call with ${character.name} on HiSanta.ai! Check it out: https://${shareUrl}`}
              target="_blank"
            >
              <EpicButton
                type="secondaryGreen"
                className="w-full"
                onClick={onClose}
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
            <EpicButton className="w-full h-12" onClick={onClose}>
              Close
            </EpicButton>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
