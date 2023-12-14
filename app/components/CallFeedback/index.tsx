import { useEffect, useState } from "react";
import { CharacterType } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import EpicButton from "../Buttons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useFlags } from "launchdarkly-react-client-sdk";


function GoodBadSwitch({
  notGood,
  onNotGoodChange,
}: {
  notGood: boolean;
  onNotGoodChange: (val: boolean) => void;
}) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <span className="text-xl md:text-xl text-Holiday-Green">
        Pretty good!
      </span>
      <Switch
        checked={notGood}
        onCheckedChange={onNotGoodChange}
        className="data-[state=unchecked]:bg-Holiday-Green data-[state=checked]:bg-Holiday-Red"
      />
      <span className="text-xl md:text-xl text-Holiday-Red">Not so good!</span>
    </div>
  );
}

function ShareCheckbox({
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

function FeedbackForm({
  onFeedbackInput,
  onEmailInput,
}: {
  onFeedbackInput: (feedback: string) => void;
  onEmailInput: (email: string) => void;
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-[Inter-Regular]">
          Tell us more! (optional)
        </AccordionTrigger>
        <AccordionContent>
          <div className="w-11/12 mx-auto flex flex-col gap-2">
            <div className="font-[Inter-Regular]">
              Thanks for your feedback. Feel free to share more about your
              experience below.
            </div>
            <div>
              <Textarea
                className="font-[Inter-Regular]"
                placeholder="Your feedback here"
                onInput={(e) =>
                  onFeedbackInput((e.target as HTMLTextAreaElement).value)
                }
              />
            </div>
            <div>
              <Input
                className="font-[Inter-Regular]"
                type="text"
                placeholder="Your email (optional)"
                onInput={(e) =>
                  onEmailInput((e.target as HTMLInputElement).value)
                }
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function CallFeedback({
  character,
  open,
  onOpenChange,
  onFeedback,
  duration,
  conversationId,
}: {
  character: CharacterType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFeedback: (good: boolean, feedback: string, email: string) => void;
  duration?: number,
  conversationId?: string;
}) {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [notGood, setNotGood] = useState(false);
  const { sharingEnabled } = useFlags();
  const [shareClicked, setShareClicked] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
      setFeedback("");
      setEmail("");
      setNotGood(false);
      setShareClicked(false);
      setSharing(false);
  }, [open]);

  const handleFeedback = () => {
    onFeedback(!notGood, feedback, email);
    if (sharingEnabled === true && shareClicked && conversationId) {
      setSharing(true);
    } else {
      onOpenChange(false);
    }
  };

  const onClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {sharing && conversationId ? (
        <SharingDialogContent duration={duration} shareUrl={`hisanta.ai/${conversationId}`} onClose={onClose} />
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-Holiday-Green text-4xl text-center">
              How was your call with{" "}
              <span className="text-Holiday-Red">{character.name}?</span>
            </DialogTitle>
            <DialogDescription>
              <div className="mx-auto w-full flex flex-col gap-4">
                <div className="mx-auto font-[Inter-Regular] text-sm">
                  Your feedback will help make HiSanta better
                </div>
                <div className="mx-auto">
                  <GoodBadSwitch
                    notGood={notGood}
                    onNotGoodChange={setNotGood}
                  />
                </div>
                <FeedbackForm
                  onEmailInput={setEmail}
                  onFeedbackInput={setFeedback}
                />
                {sharingEnabled === true && conversationId && duration && duration > 0 && (
                  <div className="w-full">
                    <ShareCheckbox
                      checked={shareClicked}
                      onCheckedChange={setShareClicked}
                    />
                  </div>
                )}
                <EpicButton className="w-full" onClick={handleFeedback}>
                  { shareClicked ? "Next" : "Send feedback" }
                </EpicButton>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
}

function SharingDialogContent({
  shareUrl,
  onClose,
  duration,
}: {
  shareUrl: string;
  onClose: () => void;
  duration?: number;
}) {
  // Duration is in milliseconds. We need minutes and seconds.
  const minutes = duration ? Math.floor(duration! / 60000) : "0";
  const seconds = duration ? ((duration! % 60000) / 1000).toFixed(0) : 0;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-Holiday-Blue text-4xl text-center">
          Share your call!
        </DialogTitle>
        <DialogDescription>
          <div className="mx-auto w-full flex flex-col gap-4 mb-4">
            <div className="flex flex-col w-full bg-slate-100 rounded-3xl font-[Inter-Regular] p-4 mb-4">
              <div className="text-sm">Your {minutes}:{seconds.toString().padStart(2, '0')} call can be replayed here:</div>
              <div className="mt-4 text-xl">{shareUrl}</div>
            </div>
            <EpicButton type="secondaryGreen" className="w-full" onClick={onClose}>
              Share on Facebook
            </EpicButton>
            <EpicButton type="secondaryGreen" className="w-full" onClick={onClose}>
              Share on Twitter
            </EpicButton>
            <EpicButton className="w-full" onClick={onClose}>
              Close
            </EpicButton>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
