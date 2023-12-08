import { VoiceSession } from "fixie/src/voice";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { VoiceSessionStats } from "../CallCharacter";

export function DebugSheet({
  open,
  onOpenChange,
  stats,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: VoiceSessionStats;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-Holiday-Red">Secret Menu!</SheetTitle>
          <SheetDescription>
            <div className="flex flex-col">
              <div className="text-Holiday-Green text-lg">You found the secret menu! Cool!</div>
              <div className="justify-start text-left font-mono mt-4">
                <p className="">
                  <strong>State:</strong> {stats.state}
                  <br />
                  <strong>ASR Latency:</strong> {stats.asrLatency}ms
                  <br />
                  <strong>LLM Response Latency:</strong>{" "}
                  {stats.llmResponseLatency}ms
                  <br />
                  <strong>LLM Token Latency:</strong> {stats.llmTokenLatency}ms
                  <br />
                  <strong>TTS Latency:</strong> {stats.ttsLatency}ms
                  <br />
                </p>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
