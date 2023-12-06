import config from "@/lib/config";
import Link from "next/link";
import Image from "next/image";
import FoxieIcon from "@/public/images/foxie-coal.svg";

export default function Header() {
  return (
    <header className="flex flex-row justify-between items-center top-0 mt-4">
      <div className="self-center text-3xl pl-4 mt-2 md:pl-8">
        <Link href="/"><span className="text-Holiday-Green">Hi</span><span className="text-Holiday-Red">Santa</span><span>.ai</span></Link>
      </div>
      <div className="pr-4 md:pr-8">
        <Link href={config.referralUrl}>
          <Image className="w-8 h-8" src={FoxieIcon} alt="Foxie" />
        </Link>
      </div>
    </header>
  );
}
