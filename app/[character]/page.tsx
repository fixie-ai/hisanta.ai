import config from '@/lib/config';
import ActiveCall from '../components/ActiveCall';
import Image from 'next/image'
import {notFound} from 'next/navigation'

// Set the runtime to Edge.
// @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
export const runtime = 'edge'

// Enable dynamic routes.
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
export const dynamicParams = true

// Set the revalidation period.
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 60

const characters = config.availableCharacters;

/**
 * Generate character pages for static generation.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  // Return the ids for each character.
  return characters.map((c) => ({
    character: c.characterId
  }))
}

// TODO -> Do we want to have dynamic metadata for each character page?
// https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata

async function getCharacter(characterId) {
  console.log(`getCharacter: ${characterId}`);
  const result = characters.find(obj => obj.characterId === characterId);
  return result ? result : null;
}

/**
 * The character page.
 */
export default async function Page({params}: {params: {character: string}}) {
  // Get the content for the character.
  console.log(`Character: ${params.character}`);
  const character = await getCharacter(params.character)

  // No character? Bail...
  if (!character) {
    notFound()
  }

  return (
    <ActiveCall currentCharacter={character} />

  )
}


