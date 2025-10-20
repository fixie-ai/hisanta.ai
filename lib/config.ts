import { CharacterType, CharacterTemplate } from './types';

/** Defines the top-level application config. */
const config = {
  siteName: 'OddsOnCompliance.com',
  siteDescription: 'Talk to Santa Eric.',
  siteUrl: 'https://oddsoncompliance.com',
  githubUrl: 'https://github.com/fixie-ai/hisanta.ai',
  referralUrl: 'https://playbook.oddsoncompliance.com',
  footerText: 'A Holiday Experiment by ',
  availableCharacters: [
    {
      characterId: 'santa',
      name: 'Santa Eric',
      image: 'eric3.png',
      bio: "It's Eric!.",
      location: 'South Florida',
      ringtone: '/sounds/jinglebells.mp3',
      agentId: 'gemini_santa',
      voiceId: 'en-US-Neural2-J', // Google Cloud TTS voice
    },
    {
      characterId: 'mrs-claus',
      name: 'Mrs. Claus',
      image: 'mrs-claus-hdpi.png',
      bio: "Santa's wife",
      location: "Santa's House",
      ringtone: '/sounds/deckthehalls.mp3',
      agentId: 'gemini_mrs-claus',
      voiceId: 'en-US-Neural2-F', // Google Cloud TTS voice
    },
    {
      characterId: 'rudolf',
      name: 'Rudolph',
      image: 'rudolf-hdpi.png',
      bio: 'Rudolph, the red-nosed reindeer.',
      location: "Santa's Stables",
      agentId: 'gemini_rudolf',
      voiceId: 'en-US-Neural2-D', // Google Cloud TTS voice
      ringtone: '/sounds/grandma.mp3',
    },
    {
      characterId: 'elfie',
      name: 'Elfie',
      image: 'elfie-hdpi.png',
      bio: "They are one of Santa's top helpers.",
      location: "Santa's Workshop",
      ringtone: '/sounds/twelvedays.mp3',
      agentId: 'gemini_elfie',
      voiceId: 'en-US-Neural2-C', // Google Cloud TTS voice
    },
    {
      characterId: 'badsanta',
      name: 'Santa Eric',
      image: 'eric3.png',
      bio: "It's Santa Eric!",
      location: 'South Florida',
      ringtone: '/sounds/jinglebells.mp3',
      agentId: 'gemini_badsanta',
      voiceId: 'en-US-Neural2-J', // Google Cloud TTS voice
      bad: true,
    },
    {
      characterId: 'grouch',
      name: 'The Grouch',
      image: 'the-grouch-hdpi.png',
      bio: "It's The Grouch.",
      location: 'Mountain Hideaway',
      ringtone: '/sounds/grinch.mp3',
      agentId: 'gemini_grouch',
      voiceId: 'en-US-Neural2-I', // Google Cloud TTS voice
      bad: true,
    },
    {
      characterId: 'karen',
      name: 'Karen Claus',
      image: 'bad-mrs-claus.png',
      bio: 'Married to Bad Santa and ready to give the world a piece of her mind.',
      location: 'Complaining to the Manager',
      ringtone: '/sounds/jinglebells.mp3',
      agentId: 'gemini_karen',
      voiceId: 'en-US-Neural2-E', // Google Cloud TTS voice
      bad: true,
    },
    {
      characterId: 'badelfie',
      name: 'Bad Elfie',
      image: 'bad-elfie.png',
      bio: 'A maligned elf who is so over you and Christmas.',
      location: "Santa's Complaint Department",
      ringtone: '/sounds/jinglebells.mp3',
      agentId: 'gemini_badelfie',
      voiceId: 'en-US-Neural2-C', // Google Cloud TTS voice
      bad: true,
    },
  ],
};
export default config;

/** Return metadata associated with the given character. */
export function getCharacter(characterId: string): CharacterType | null {
  return config.availableCharacters.find((obj) => obj.characterId === characterId) ?? null;
}

export const characterTemplates: CharacterTemplate[] = [
  {
    templateId: 'penguin',
    image: 'penguin-hdpi.png',
    voiceId: 'en-US-Neural2-C', // Google Cloud TTS voice
    names: ['Pengly', 'Bebop', 'Mr. Feet', 'Dipstick', 'Icee'],
    bios: [
      'A penguin who loves to dance.',
      'A penguin who loves to eat fish.',
      'A penguin who loves to swim.',
      'A penguin who loves to slide.',
    ],
    greetings: ["Hi, I'm {name}. Merry Christmas!"],
    ringtone: '/sounds/jinglebells.mp3',
  },
];

export function getTemplate(templateId: string): CharacterTemplate | null {
  return characterTemplates.find((obj) => obj.templateId === templateId) ?? null;
}
