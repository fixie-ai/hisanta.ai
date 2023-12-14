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
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useFlags } from "launchdarkly-react-client-sdk";
import { ShareCheckbox, SharingDialogContent } from "../Sharing";
import { Toggle } from "../ui/toggle";
import { datadogRum } from "@datadog/browser-rum";

function GoodBadSelector({
  good,
  bad,
  onGoodChange,
  onBadChange,
}: {
  good: boolean;
  bad: boolean;
  onGoodChange: (val: boolean) => void;
  onBadChange: (val: boolean) => void;
}) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Toggle
        variant="outline"
        aria-label="Good"
        className="text-2xl text-Holiday-Green hover:text-Holiday-Green hover:bg-white data-[state=on]:bg-white data-[state=on]:text-Holiday-Green data-[state=on]:border-2 data-[state=on]:border-Holiday-Green"
        pressed={good}
        onPressedChange={onGoodChange}
      >
        Pretty good!
      </Toggle>
      <Toggle
        variant="outline"
        aria-label="Not Good"
        className="text-2xl text-Holiday-Red hover:text-Holiday-Red hover:bg-white data-[state=on]:bg-white data-[state=on]:text-Holiday-Red data-[state=on]:border-2 data-[state=on]:border-Holiday-Red border"
        pressed={bad}
        onPressedChange={onBadChange}
      >
        Not so good!
      </Toggle>
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
  onFeedback: ({
    good,
    feedback,
    email,
  }: {
    good?: boolean;
    feedback: string;
    email: string;
  }) => void;
  duration?: number;
  conversationId?: string;
}) {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [good, setGood] = useState(false);
  const [bad, setBad] = useState(false);
  const { sharingEnabled } = useFlags();
  const [shareClicked, setShareClicked] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    setFeedback("");
    setEmail("");
    setGood(false);
    setBad(false);
    setShareClicked(false);
    setSharing(false);
  }, [open]);

  const handleFeedback = () => {
    const callGood = !good && !bad ? undefined : good;
    onFeedback({ good: callGood, feedback, email });
    if (sharingEnabled === true && shareClicked && conversationId) {
      datadogRum.addAction("share-selected", {
        conversationId: conversationId || "",
      });
      setSharing(true);
    } else {
      onOpenChange(false);
    }
  };

  const onClose = () => {
    onOpenChange(false);
  };

  const onGoodChange = (val: boolean) => {
    setGood(val);
    if (val) {
      setBad(false);
    }
  };

  const onBadChange = (val: boolean) => {
    setBad(val);
    if (val) {
      setGood(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {sharing && conversationId ? (
        <SharingDialogContent
          duration={duration}
          roomId={conversationId} // XXX XXX MDW TODO: Replace with room ID.
          onClose={onClose}
        />
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
                  <GoodBadSelector
                    good={good}
                    bad={bad}
                    onGoodChange={onGoodChange}
                    onBadChange={onBadChange}
                  />
                </div>
                <FeedbackForm
                  onEmailInput={setEmail}
                  onFeedbackInput={setFeedback}
                />
                {sharingEnabled === true &&
                  conversationId &&
                  duration &&
                  duration > 0 && (
                    <div className="w-full">
                      <ShareCheckbox
                        checked={shareClicked}
                        onCheckedChange={setShareClicked}
                      />
                    </div>
                  )}
                <EpicButton className="w-full" onClick={handleFeedback}>
                  {shareClicked ? "Next" : "Send feedback"}
                </EpicButton>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
}
