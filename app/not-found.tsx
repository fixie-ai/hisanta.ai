import Link from "next/link";
import EpicButton from "./components/Buttons";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="w-full flex flex-col items-center mt-8">
      <div className="w-11/12 mx-auto flex flex-col items-center">
        <div className="text-4xl justify-center text-center">
          Lost in the Snow?
        </div>
        <div className="font-[Inter-Regular] text-xl mt-4 mb-6 text-center">
          This page does not exist.
        </div>
        <div>
          <Image
            src="/images/notfound.png"
            alt="404 Image"
            width={200}
            height={200}
          />
        </div>
        <div className="mt-12 mb-12">
          <EpicButton className="w-full">
            <Link href="/">Back to Home</Link>
          </EpicButton>
        </div>
      </div>
    </div>
  );
}
