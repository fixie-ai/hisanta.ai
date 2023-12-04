export type CharacterType = {
  characterId: string
  name: string
  image: string
  bio: string
  location: string
}

export interface ActiveCallProps {
  currentCharacter: CharacterType;
}
