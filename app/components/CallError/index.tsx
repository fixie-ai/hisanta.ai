import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";

export function CallError({
  err,
  open,
  onOpenChange,
}: {
  err: string;
  open: boolean;
  onOpenChange: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-Holiday-Green text-4xl text-center">
            Connection Error
          </DialogTitle>
          <DialogDescription className="text-lg">
            <Image
              src="/images/igloo.png"
              alt="Too Busy Image"
              width={250}
              height={250}
              className="mx-auto my-4"
            />
            {err === "Permission denied"
              ? "In order to talk to Santa & Friends, you need to allow access to your microphone. Please refresh the page and try again."
              : "Uh oh, seems like there are connections issues with the North Pole. Please refresh the page and try again."}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
