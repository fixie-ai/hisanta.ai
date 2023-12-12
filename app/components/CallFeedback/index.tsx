import { useState } from "react";
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
        <AccordionTrigger>Tell us more!</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2">
            <div className="font-[Inter-Regular]">
              Thanks for your feedback. Feel free to share more about your
              experience below.
            </div>
            <div>
              <Textarea
                className="font-[Inter-Regular]"
                placeholder="Your feedback here"
                onInput={(e) => onFeedbackInput((e.target as HTMLTextAreaElement).value)}
              />
            </div>
            <div>
              <Input
                className="font-[Inter-Regular]"
                type="text"
                placeholder="Your email (optional)"
                onInput={(e) => onEmailInput((e.target as HTMLInputElement).value)}
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
}: {
  character: CharacterType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFeedback: (good: boolean, feedback: string, email: string) => void;
}) {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");

  const handleFeedback = (good: boolean) => () => {
    onFeedback(good, feedback, email);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-Holiday-Green text-4xl text-center">
            How was your call with{" "}
            <span className="text-Holiday-Red">{character.name}?</span>
          </DialogTitle>
          <DialogDescription>
            <div className="mx-auto w-60% mt-8 flex flex-col gap-4">
              <div className="mx-auto flex flex-col md:flex-row gap-4 w-fit">
                <EpicButton
                  onClick={handleFeedback(true)}
                  type="secondaryGreen"
                >
                  Good!
                </EpicButton>
                <EpicButton onClick={handleFeedback(false)} type="secondaryRed">
                  Not so good!
                </EpicButton>
              </div>
              <div className="mx-auto mt-4 font-[Inter-Regular]">
                Your feedback will help make{" "}
                <span className="font-sans">HiSanta</span> better!
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm onEmailInput={setEmail} onFeedbackInput={setFeedback} />
      </DialogContent>
    </Dialog>
  );
}
