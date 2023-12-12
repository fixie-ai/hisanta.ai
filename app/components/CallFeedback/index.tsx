import { CharacterType } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import EpicButton from "../Buttons";

export function CallFeedback({
  character,
  open,
  onOpenChange,
  onFeedback,
}: {
  character: CharacterType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFeedback: (good: boolean) => void;
}) {
  const handleFeedback = (good: boolean) => () => {
    onFeedback(good);
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
      </DialogContent>
    </Dialog>
  );
}
