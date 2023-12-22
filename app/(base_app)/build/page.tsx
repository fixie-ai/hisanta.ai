import { CharacterBuilder } from '../../components/CharacterBuilder';
import { LoginButton } from '../../components/LoginButton';
import { auth } from '@/lib/auth';

// Set the runtime to Edge.
// @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
export const runtime = 'edge';

// Enable dynamic routes.
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
export const dynamicParams = true;

// Set the revalidation period.
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 60;

/** Build character page. */
export default async function Page({ params }: { params: { character: string } }) {
  const session = await auth();
  console.log("MDW: GOT SESSION", session);

  if (!session) {
    return <LoginButton />;
  }

  return (
    <div className="mx-auto flex flex-col w-full mt-4">
      <div className="text-center mx-auto text-2xl">Build your own holiday character</div>
      <CharacterBuilder />
    </div>
  );
}
