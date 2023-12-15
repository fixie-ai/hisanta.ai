export const runtime = 'edge';

import { loadCharacter } from '@/lib/storage';

type RouteSegment = { params: { character: string } };

/** Return the given character. */
export async function GET(req: Request, { params }: RouteSegment): Promise<Response> {
  const character = await loadCharacter(params.character);
  return new Response(JSON.stringify(character), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  });
}
