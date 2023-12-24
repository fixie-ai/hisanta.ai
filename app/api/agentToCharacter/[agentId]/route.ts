import { loadCharacterByAgentId } from '@/lib/storage';

type RouteSegment = { params: { agentId: string } };

/** Return the given character. */
export async function GET(req: Request, { params }: RouteSegment): Promise<Response> {
  try {
    const character = await loadCharacterByAgentId(params.agentId);
    return new Response(JSON.stringify(character), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 404 });
  }
}
