import EpicButton from '../../../components/Buttons';
import { SharedCall } from '../../../components/SharedCall';
import Link from 'next/link';

// Set the runtime to Edge.
// @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
//export const runtime = 'edge';

// Enable dynamic routes.
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
export const dynamicParams = true;

// Set the revalidation period.
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 60;

/**
 * The character page.
 */
export default async function Page({ params }: { params: { shareKey: string } }) {
  return (
    <div className="mx-auto flex flex-col w-full mt-4">
      <div className="text-center mx-auto text-2xl">Talk to Santa &amp; friends, powered by AI!</div>
      <SharedCall shareKey={params.shareKey} />
      <div className="mt-4 w-[340px] mx-auto">
        <Link href="/">
          <EpicButton type="primary" className="w-full">
            Try it now!
          </EpicButton>
        </Link>
      </div>
    </div>
  );
}
