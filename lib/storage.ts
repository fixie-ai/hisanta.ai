import { kv } from '@vercel/kv';
import { CharacterType } from '@/lib/types';

/** Load the given Character from KV. */
export async function loadCharacter(characterId: string): Promise<CharacterType> {
  const character = await kv.json.get(`character:${characterId}`, '$');
  if (character === null) {
    throw new Error(`Character ${characterId} not found`);
  }
  return (character as CharacterType[])[0];
}

/** Store the given Character to KV. */
export async function saveCharacter(character: CharacterType): Promise<void> {
  await kv.json.set(`character:${character.characterId}`, '$', character);
}
