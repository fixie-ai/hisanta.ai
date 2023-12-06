import { CharacterType } from './types';

/** Defines the top-level application config. */
const config = {
  siteName: 'Hisanta.ai',
  siteDescription: 'Talk to Santa Claus and his friends.',
  siteUrl: 'https://hisanta.ai',
  githubUrl: 'https://github.com/fixie-ai/hisanta.ai',
  referralUrl: 'https://fixie.ai',
  footerText: 'A Holiday Experiment by',
  availableCharacters: [
    {
      characterId: "santa",
      name: "Santa",
      image: "santa-svg.svg",
      bio: "It's Santa.",
      location: "The North Pole",
      ringtone: "/sounds/deckthehalls.mp3",
    },
    {
      characterId: "elf",
      name: "Elfie",
      image: "elfie-placeholder.png",
      bio: "They are one of Santa's top helpers.",
      location: "Santa's Workshop",
      ringtone: "/sounds/deckthehalls.mp3",
    },
    {
      characterId: "grinch",
      name: "The Grinch",
      image: "grinch-placeholder.png",
      bio: "He's a mean one, Mr. Grinch.",
      location: "Whoville",
      ringtone: "/sounds/deckthehalls.mp3",
    },
    {
      characterId: "snowman",
      name: "Snowman",
      image: "elfie-placeholder.png",
      bio: "Snowman is a jolly, happy soul.",
      location: "Melting in the Sun.",
      ringtone: "/sounds/deckthehalls.mp3",
    },
    {
      characterId: "rudolph",
      name: "Rudolph",
      image: "rudolph-placeholder.png",
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
