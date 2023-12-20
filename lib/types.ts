export type CharacterType = {
  characterId: string;
  name: string;
  image: string;
  bio: string;
  location: string;
  ringtone: string;
  agentId: string;
  voiceId: string;
  bad?: boolean;
  generatedImage: boolean; 
};
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
};

export interface EpicButtonProps {
  children: React.ReactNode;
  type?: 'primary' | 'secondaryGreen' | 'secondaryRed';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

/** Template for new characters. */
export interface CharacterTemplate {
  templateId: string;
  image: string;
  voiceId: string;
  names: string[];
  bios: string[];
  greetings: string[];
  ringtone: string;
}

/**
 * This is the body of the POST request to /api/character for creating
 * a new character.
 */
export type CreateCharacterRequest = {
  // The template ID to use for this character.
  templateId: string;
  // The name of the character, e.g., "Mr. Bubbles".
  name: string;
  // A bio of the character. This will be used to build the
  // character prompt.
  bio: string;
  // The character's greeting.
  greeting: string;

  voiceId: string;

  ringtone: string;
  
  customImage: string | null;

};

export type GenerateCharacterImageRequest = {
  characterDescription: string;
};

export type AgentToCharacterData = {
  templateId: string;
  generatedImageURL: string;
};