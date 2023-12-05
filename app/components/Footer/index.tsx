import config from '@/lib/config'
import Link from 'next/link';
import Image from 'next/image';
import FixieLogo from '@/public/images/FixieLogo.svg';

export default function Footer() {
  return (
    <footer className="mt-8 flex flex-row justify-center text-sm text-center">
      <div className="text-black font-['Inter-SemiBold']">{config.footerText} &nbsp;</div>
      <Link href={config.referralUrl}>
        <Image src={FixieLogo} alt="Fixie Logo" width={60} height={20} />
      </Link> 
    </footer>
  )
}