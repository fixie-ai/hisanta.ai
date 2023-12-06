import { CharacterType } from './types';

/** Defines the top-level application config. */
const config = {
  siteName: 'Hisanta.ai',
  siteDescription: 'Talk to Santa Claus and his friends.',
  siteUrl: 'https://hisanta.ai',
  githubUrl: 'https://github.com/fixie-ai/hisanta.ai',
  referralUrl: 'https://fixie.ai',
  footerText: 'A Holiday Experiment by Fixie',
  availableCharacters: [
    {
      characterId: "santa",
      name: "Santa",
      image: "santa.png",
      bio: "It's Santa.",
      location: "The North Pole",
      ringtone: "/sounds/deckthehalls.mp3",
      agent_id: "5d37e2c5-1e96-4c48-b3f1-98ac08d40b9a",
      voice_id: "",
    },
    {
      characterId: "mrs-claus",
      name: "Mrs. Claus",
      image: "mrs-claus.png",
      bio: "Santa's wife",
      location: "Santa's Workshop",
      ringtone: "/sounds/deckthehalls.mp3",
      agent_id: "339f7e31-4d7e-461b-8d75-6afad87224de",
      voice_id: "ePzPl7sij9imLmib0Hvd"
    },
    {
      characterId: "rudolph",
      name: "Rudolph",
      image: "rudolph.png",
      bio: "Rudolph, the red-nosed reindeer.",
      location: "Santa's Stables",
      ringtone: "/sounds/deckthehalls.mp3",
    },
    {
      characterId: "elf",
      name: "Elfie",
      image: "elfie-placeholder.png",
      bio: "They are one of Santa's top helpers.",
      location: "Santa's Workshop",
      ringtone: "/sounds/deckthehalls.mp3",
    }
  ],
}
export default config;

/** Return metadata associated with the given character. */
export function getCharacter(characterId: string): CharacterType | null {
  return config.availableCharacters.find(obj => obj.characterId === characterId) ?? null;
}
