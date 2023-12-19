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

/** Load the Character ID mapped to the given Agent ID from KV. */
export async function loadCharacterIdByAgentId(agentId: string): Promise<string> {
  const characterId = await kv.get(`agent:${agentId}`);
  if (characterId === null) {
    throw new Error(`Character ID not found for Agent ${agentId}`);
  }
  return String(characterId);
}

/** Store the mapping of Agent ID to Character ID to KV. */
export async function saveAgentCharacterMapping(agentId: string, characterId: string): Promise<void> {
  await kv.set(`agent:${agentId}`, characterId);
}

/** Save Agent ID to Image */
export async function saveAgentImageMapping(agentId: string, image: string): Promise<void> {
  await kv.set(`agentImage:${agentId}`, image);
}

/** Load Agent ID to Image */
export async function loadAgentImageMapping(agentId: string): Promise<string> {
  const image = await kv.get(`agentImage:${agentId}`);
  if (image === null) {
    throw new Error(`Image not found for Agent ${agentId}`);
  }
  return String(image);
}

