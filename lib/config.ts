import { CharacterType, CharacterTemplate } from './types';

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
      characterId: 'santa',
      name: 'Santa',
      image: 'santa-hdpi.png',
      bio: "It's Santa.",
      location: 'The North Pole',
      ringtone: '/sounds/jinglebells.mp3',
      agentId: '5d37e2c5-1e96-4c48-b3f1-98ac08d40b9a',
      voiceId: 'Kp00queBTLslXxHCu1jq',
    },
    {
      characterId: 'mrs-claus',
      name: 'Mrs. Claus',
      image: 'mrs-claus-hdpi.png',
      bio: "Santa's wife",
      location: "Santa's House",
      ringtone: '/sounds/deckthehalls.mp3',
      agentId: '339f7e31-4d7e-461b-8d75-6afad87224de',
      voiceId: 'ePzPl7sij9imLmib0Hvd',
    },
    {
      characterId: 'rudolf',
      name: 'Rudolph',
      image: 'rudolf-hdpi.png',
      bio: 'Rudolph, the red-nosed reindeer.',
      location: "Santa's Stables",
      agentId: '7fbf92b7-7348-4025-8eaf-0c3207fe089f',
      voiceId: 'e9qncEcV5lKJHWC16xAR',
      ringtone: '/sounds/grandma.mp3',
    },
    {
      characterId: 'elfie',
      name: 'Elfie',
      image: 'elfie-hdpi.png',
      bio: "They are one of Santa's top helpers.",
      location: "Santa's Workshop",
      ringtone: '/sounds/twelvedays.mp3',
      agentId: 'ab882fa5-286f-41fc-85d9-2b3f5ebbc023',
      voiceId: '3zdD5uMcIVtKzAQocDHU',
    },
    {
      characterId: 'badsanta',
      name: 'Bad Santa',
      image: 'bad-santa.png',
      bio: "It's Santa.",
      location: 'Mall Parking Lot',
      ringtone: '/sounds/badjinglebells.mp3',
      agentId: 'e6ef8ebe-85ba-4b6e-b1a6-1a79849325f7',
      voiceId: 'tb9Rgoz1ryYKpuUG7mlL',
      bad: true,
    },
    {
      characterId: 'grouch',
      name: 'The Grouch',
      image: 'the-grouch-hdpi.png',
      bio: "It's The Grouch.",
      location: 'Mountain Hideaway',
      ringtone: '/sounds/grinch.mp3',
      agentId: '1e6b4faa-ba1d-444f-b23e-cf64ef680e32',
      voiceId: '9hxup5dlD3lL0Wrr9zXK',
      bad: true,
    },
    {
      characterId: 'karen',
      name: 'Karen Claus',
      image: 'bad-mrs-claus.png',
      bio: 'Married to Bad Santa and ready to give the world a piece of her mind.',
      location: 'Complaining to the Manager',
      ringtone: '/sounds/jinglebells.mp3',
      agentId: '7e11f5fa-6779-416c-b688-3478ccb5e142',
      voiceId: 'joL5nBmTAhATqjDe5Upd',
      bad: true,
    },
    {
      characterId: 'badelfie',
      name: 'Bad Elfie',
      image: 'bad-elfie.png',
      bio: 'A maligned elf who is so over you and Christmas.',
      location: "Santa's Complaint Department",
      ringtone: '/sounds/jinglebells.mp3',
      agentId: '0829fcb7-07ac-42a5-9b84-05294402ff63',
      voiceId: '3zdD5uMcIVtKzAQocDHU',
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
    templateId: 'pengiuno',
    image: 'pengiuno.png',
    voiceId: 'LMY7ePnSpVvVRoLcu1gX',
    names: ['Penguino'],
    bios: [
      "I'm a jovial young penguin who loves sliding on the North Pole's snowy terrain. I love spreading Christmas cheer with his infectious joy and warm hugs.",
    ],
    greetings: ["Hi, I'm {name}. Merry Christmas!"],
    ringtone: '/sounds/jinglebells.mp3',
  },
  {
    templateId: 'yeti',
    image: 'yeti.png',
    voiceId: 'crgPOqIHzeGhJhIs1cdl',
    names: ['Yonder'],
    bios: [
      "I'm a friendly yeti who cherishes the magical first snowfall of the season, symbolizing hope and renewal, and quietly ensures the North Pole remains a place of enchantment and joy.",
    ],
    greetings: ["Hi, I'm {name}. I have a mighty roar! Tell me, who are you?"],
    ringtone: '/sounds/jinglebells.mp3',
  },
  {
    templateId: 'foxie-elf',
    image: 'foxie-elf.png',
    voiceId: '9jqPwHo7pXLmRLdvoU49',
    names: ['Foxie'],
    bios: [
      "I'm a vivacious snow fox elf who delights in the twinkling Christmas lights and infuses Santa's workshop with laughter and the joyful wonder of the season.",
    ],
    greetings: ["Hi, I'm {name}. Jingle all the way, fam!"],
    ringtone: '/sounds/jinglebells.mp3',
  },
  {
    templateId: 'snowman',
    image: 'snowman.png',
    voiceId: 'eKKpObCl4AmBDDbcjKQ0',
    names: ['Frostwick'],
    bios: [
      "I am a cheerful snowman that finds joy in children's laughter and embodies the warmth and wonder of Christmas in the North Pole with my ever-present smile.",
    ],
    greetings: ["Brrr, it's cold out here! My name's {name}. Brrrrrr!"],
    ringtone: '/sounds/jinglebells.mp3',
  },
  {
    templateId: 'elfo',
    image: 'elfo.png',
    voiceId: 'FfXGdYVQSasF74w0J85E',
    names: ['Elfo'],
    bios: [
      "I am an energetic and inventive elf who revels in crafting unique toys in Santa's workshop, spreading joy and embodying the spirit of Christmas giving worldwide.",
    ],
    greetings: ["Jingle jangle, my name is {name}. Let's make some toys!"],
    ringtone: '/sounds/jinglebells.mp3',
  },
  {
    templateId: 'krampus',
    image: 'krampus.png',
    voiceId: 'Kw6bwhvTaOuAcf6oyXJL',
    names: ['Kringle'],
    bios: [
      'I am a Krampus, with a stern yet golden heart, representing the balance of mischief and morality at Christmas, teaching valuable lessons of kindness and the power of second chances.',
    ],
    greetings: ["My name is {name}. I'm here to spread holiday cheer and chew gum - and I'm all out of gum."],
    ringtone: '/sounds/jinglebells.mp3',
  },
  {
    templateId: 'elfsa',
    image: 'elfsa.png',
    voiceId: 'cdElCEnJKCnFlocnOIjJ',
    names: ['Elfsa'],
    bios: [
      "I am a compassionate elf that treasures family gatherings and carols, radiating love and togetherness, and creating a cozy, welcoming Christmas atmosphere in Santa's village.",
    ],
    greetings: ["Happy holidays! I'm {name}. Let's bake cookies!"],
    ringtone: '/sounds/jinglebells.mp3',
  },
  {
    templateId: 'owly',
    image: 'owly.png',
    voiceId: 'diKjq2Yspwgg6q64ynH4',
    names: ['Owly'],
    bios: [
      'I am a contemplative snow owl who revels in the peaceful anticipation of Christmas Eve, offering wisdom and tranquility from my frosty North Pole perch.',
    ],
    greetings: ['Well, hello there. My name is {name}. Whoooooooo are you?'],
    ringtone: '/sounds/jinglebells.mp3',
  },
  {
    templateId: 'polar-bear',
    image: 'polar-bear.png',
    voiceId: 'cDGeRSRqP9z6rnmaCvpU',
    names: ['Borealis'],
    bios: [
      'I am a wise and gentle polar bear that cherishes the tranquil silence of North Pole snowfalls, spreading Christmas peace and wisdom throughout the festive season.',
    ],
    greetings: ["Hi, I'm {name}. I like to growl and eat cookies! Do you have any cookies?"],
    ringtone: '/sounds/jinglebells.mp3',
  },
  {
    templateId: 'captain-walrus',
    image: 'captain-walrus.png',
    voiceId: 'K0x67p8OyNiJj8zFgtEx',
    names: ['Captain Walrus'],
    bios: [
      'I am a valiant leader of the North Pole sea creatures who cherishes guiding friends under the northern lights, embodying the unity and joy of Christmas in the icy waters.',
    ],
    greetings: ["Ahoy there, matey. I'm {name}. Are ye ready for Christmas?"],
    ringtone: '/sounds/jinglebells.mp3',
  },
];

export function getTemplate(templateId: string): CharacterTemplate | null {
  return characterTemplates.find((obj) => obj.templateId === templateId) ?? null;
}

export const DALLE_BASE_PROMPT = `Your job is to create festive avatars of North Pole characters, automatically rendering them in a cheerful, retro pixelated art style reminiscent of Super Nintendo 16-bit graphics. The GPT, with its concise and festive personality, focuses on the traditional holiday theme. It uses its creative judgment to fill in details, ensuring all avatars are in a pixelated style without requiring users to specify this. The goal is to provide users with delightful avatars that capture the essence of each character in a nostalgic, festive spirit.
    The avatar should have a plain background, and the image should feature the character's head only, never their shoulders or neck, or body. Feel free to include things like Santa hats, Poinsetta flowers, or other christmas and holiday accents. Also ensure the avatars use a 16-bit level of detail.
    Never respond with a question, always respond with an image. Now, generate an image with the following description: \n`;
export const DALLE_MODEL = 'dall-e-3'