export const runtime = 'edge';

import { loadCharacterIdByAgentId } from '@/lib/storage';

type RouteSegment = { params: { agentId: string } };

/** Return the given character. */
export async function GET(req: Request, { params }: RouteSegment): Promise<Response> {
  try {
    const characterId = await loadCharacterIdByAgentId(params.agentId);
    return new Response(JSON.stringify(characterId), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 404 });
  }
}
