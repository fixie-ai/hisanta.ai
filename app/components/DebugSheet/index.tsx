import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import config from '@/lib/config';
import { VoiceSession } from 'fixie/src/voice';
import { VoiceSessionStats } from '../CallCharacter';
import EpicButton from '../Buttons';

export function DebugSheet({
  open,
  onOpenChange,
  stats,
  voiceSession,
  inCall,
  llmModels,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: VoiceSessionStats;
  voiceSession: VoiceSession | null;
  inCall: boolean;
  onSubmit: (character?: string, model?: string) => void;
  llmModels: string[];
}) {
  const [character, setCharacter] = useState<string>();
  const [model, setModel] = useState<string>();
  const characters = config.availableCharacters;

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
                  <strong>In call:</strong> {inCall ? 'true' : 'false'}
                  <br />
                  <strong>State:</strong> {stats.state || 'unknown'}
                  <br />
                  <strong>ASR Latency:</strong> {stats.asrLatency}ms
                  <br />
                  <strong>LLM Response Latency:</strong> {stats.llmResponseLatency}ms
                  <br />
                  <strong>LLM Token Latency:</strong> {stats.llmTokenLatency}ms
                  <br />
                  <strong>TTS Latency:</strong> {stats.ttsLatency}ms
                  <br />
                  <div className="mt-4">
                    <Select value={character} onValueChange={setCharacter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Character" />
                      </SelectTrigger>
                      <SelectContent>
                        {characters.map((character, index) => (
                          <SelectItem key={index} value={character.characterId} className="font-mono">
                            {character.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-4">
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {llmModels.map((model, index) => (
                          <SelectItem key={index} value={model} className="font-mono">
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <EpicButton type="secondaryRed" className="mt-4" onClick={() => onSubmit(character, model)}>
                    <span className="font-sans text-md">Magic!</span>
                  </EpicButton>
                </p>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
