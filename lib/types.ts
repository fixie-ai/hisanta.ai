export type CharacterType = {
  characterId: string
  name: string
  image: string
  bio: string
  location: string
  ringtone: string
  agent_id: string
  voice_id: string
}
export interface ActiveCallProps {
  currentCharacter: CharacterType;
}

export interface NameInputProps {
  inputValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export type PickerButtonProps = {
  className?: string;
  currentCharacter: CharacterType;
}

export interface EpicButtonProps {
  children: React.ReactNode;
  type?: 'primary' | 'secondaryGreen' | 'secondaryRed';
  className?: string;
}