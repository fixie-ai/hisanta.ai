import { CharacterType } from '@/lib/types';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import EpicButton from '../Buttons';

export function ShareCharacter({ character }: { character: CharacterType }) {
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className="w-full">
          <EpicButton type="secondaryGreen" className="w-full">
            Share {character.name}
          </EpicButton>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-Holiday-Green text-4xl text-center">
            Share <span className="text-Holiday-Red">{character.name}</span>
          </DialogTitle>
          <DialogDescription>
            <div className="mx-auto w-full flex flex-col gap-4"></div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
