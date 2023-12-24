import { loadCharacter } from '@/lib/storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { kv } from '@vercel/kv';

type RouteSegment = { params: { character: string } };

/** Return the given character. */
export async function GET(req: Request, { params }: RouteSegment): Promise<Response> {
  try {
    const character = await loadCharacter(params.character);
    return new Response(JSON.stringify(character), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 404 });
  }
}

/** Save the given character to the current user's profile. */
export async function POST(req: Request, { params }: RouteSegment): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 403 });
  }

  try {
    const character = await loadCharacter(params.character);
    const owner = session.user.email;
    await kv.json.set(`user:${owner}:${character.characterId}`, '$', character);
    return new Response(JSON.stringify(character), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 404 });
  }
}

/** Remove the given character to the current user's profile. */
export async function DELETE(req: Request, { params }: RouteSegment): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 403 });
  }

  try {
    const character = await loadCharacter(params.character);
    const owner = session.user.email;
    await kv.json.del(`user:${owner}:${character.characterId}`);
    return new Response(null, {
      headers: { 'content-type': 'application/json' },
      status: 204,
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 404 });
  }
}
