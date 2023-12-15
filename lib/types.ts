export type CharacterType = {
  characterId: string
  name: string
  image: string
  bio: string
  location: string
  ringtone: string
  agentId: string
  voiceId: string
  bad?: boolean
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
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * This is the body of the POST request to /api/character for creating
 * a new character.
 */
export type CreateCharacterRequest = {
  // The name of the character, e.g., "Mr. Bubbles".
  name: string
  // A description of the character. This will be used to build the
  // character prompt.
  description: string
  // The character's avatar. This is specified as a
  // one of the keys of the AVATARS object in api/character/router.ts.
  avatar: string
  // The voice ID to use for this character.
  voiceId: string
}