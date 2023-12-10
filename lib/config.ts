import { CharacterType } from './types';

/** Defines the top-level application config. */
const config = {
  siteName: 'Hisanta.ai',
  siteDescription: 'Talk to Santa Claus and his friends.',
  siteUrl: 'https://hisanta.ai',
  githubUrl: 'https://github.com/fixie-ai/hisanta.ai',
  referralUrl: 'https://fixie.ai',
  footerText: 'A Holiday Experiment by ',
  availableCharacters: [
    {
      characterId: "santa",
      name: "Santa",
      image: "santa-hdpi.png",
      bio: "It's Santa.",
      location: "The North Pole",
      ringtone: "/sounds/jinglebells.mp3",
      agentId: "5d37e2c5-1e96-4c48-b3f1-98ac08d40b9a",
      voiceId: "Kp00queBTLslXxHCu1jq",
    },
    {
      characterId: "mrs-claus",
    name: "Mrs. Claus",
      image: "mrs-claus-hdpi.png",
      bio: "Santa's wife",
      location: "Santa's House",
      ringtone: "/sounds/deckthehalls.mp3",
      agentId: "339f7e31-4d7e-461b-8d75-6afad87224de",
      voiceId: "ePzPl7sij9imLmib0Hvd"
    },
    {
      characterId: "rudolf",
      name: "Rudolf",
      image: "rudolf-hdpi.png",
      bio: "Rudolph, the red-nosed reindeer.",
      location: "Santa's Stables",
      agentId: "7fbf92b7-7348-4025-8eaf-0c3207fe089f",
      voiceId: "e9qncEcV5lKJHWC16xAR",
      ringtone: "/sounds/grandma.mp3",
    },
    {
      characterId: "elfie",
      name: "Elfie",
      image: "elfie-hdpi.png",
      bio: "They are one of Santa's top helpers.",
      location: "Santa's Workshop",
      ringtone: "/sounds/twelvedays.mp3",
      agentId: "ab882fa5-286f-41fc-85d9-2b3f5ebbc023",
      voiceId: "3zdD5uMcIVtKzAQocDHU"
    }
  ],
}
export default config;

/** Return metadata associated with the given character. */
export function getCharacter(characterId: string): CharacterType | null {
  return config.availableCharacters.find(obj => obj.characterId === characterId) ?? null;
}
