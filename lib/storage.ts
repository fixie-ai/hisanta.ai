import { kv } from '@vercel/kv';
import { put, head } from '@vercel/blob'; 
import { CharacterType, AgentToCharacterData } from '@/lib/types';
import { Uuid } from 'uuid-tool';
import fs from 'fs';

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

/** Load the Character Data mapped to the given Agent ID from KV. */
export async function loadCharacterByAgentId(agentId: string): Promise<AgentToCharacterData> {
  const characterDataJson = await kv.json.get(`agent:${agentId}`);
  if (!characterDataJson) {
    throw new Error(`Character data not found for Agent ${agentId}`);
  }

  try { 
    const characterData = JSON.parse(characterDataJson);
    return characterData;
  } catch (error: any) {
    // Handle JSON parsing errors
    throw new Error(`Error parsing character data for Agent ${agentId}: ${error.message}`);
  }
}

/** Store the mapping of Agent ID to Character Data to KV. */
export async function saveAgentCharacterMapping(agentId: string, templateId: string, imageBlob: Blob | null): Promise<AgentToCharacterData> {
  console.log(`Saving agent ${agentId} with templateId ${templateId}`);
  const uuid = new Uuid().toString();

  let characterData = {
    templateId: templateId,
    generatedImageURL: '',
  }
  if (imageBlob) {
    // Create an object with the templateId and generatedImage
    const { url } = await put(uuid, imageBlob, { access: 'public'}); 
    characterData = {
      templateId: templateId,
      generatedImageURL: url,  
    };
    console.log('image url: ', url)
  } 

  // Save this object in your key-value store with the agent's ID as the key
  await kv.set(`agent:${agentId}`, characterData);
  return characterData;
}
