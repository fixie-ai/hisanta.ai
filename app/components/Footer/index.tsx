import config from "@/lib/config";
import Link from "next/link";
import Image from "next/image";
import FixieLogo from "@/public/images/FixieLogo.svg";

export default function Footer() {
  return (
    <footer>
      <div className="hidden md:block">
        <FooterWide />
      </div>
      <div className="block md:hidden">
        <FooterMobile />
      </div>
    </footer>
  );
}

function Dot() {
  return (
    <div className="text-slate-700 font-['Inter-Regular'] text-xs mx-4">•</div>
  );
}

function Experiment() {
  return (
      <div className="flex flex-row">
        <div className="text-slate-700 font-['Inter-SemiBold'] text-xs sm:text-sm mr-2">
          {config.footerText}
        </div>
        <Link href={config.referralUrl}>
          <Image src={FixieLogo} alt="Fixie Logo" width={60} height={20} />
        </Link>
      </div>
  );
}

function FooterLinks() {
  return (
    <>
      <div className="text-slate-700 font-['Inter-SemiBold'] text-xs">
        We&apos;re hiring!
      </div>
      <Dot />
      <div className="text-slate-700 font-['Inter-SemiBold'] text-xs">
        How we built this
      </div>
      <Dot />
      <div className="text-slate-700 font-['Inter-SemiBold'] text-xs">
        Learn more
      </div>
    </>
  );
}



function FooterWide() {
  return (
    <div className="mx-auto px-4 py-2 w-fit mt-4 md:mt-8 flex flex-row justify-between items-center text-sm text-center bg-white rounded-full">
      <Experiment />
      <Dot />
      <FooterLinks />
    </div>
  );
}

function FooterMobile() {
  return (
    <div className="mx-auto px-4 py-2 w-fit mt-4 md:mt-8 flex flex-col justify-center items-center text-sm text-center bg-white rounded-full">
      <Experiment />
      <div className="flex flex-row mt-2">
        <FooterLinks />
      </div>
    </div>
  );
}
