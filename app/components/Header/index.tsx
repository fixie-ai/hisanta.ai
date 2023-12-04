import config from '@/lib/config';
import Link from 'next/link';
import Image from 'next/image';
import FoxieIcon from '@/public/images/foxie-coal.svg';

export default function Header() {
  return (
    <header className="flex justify-between mt-4">
      <div className="text-2xl">
        <Link href="/">
          {config.siteName}
        </Link>
      </div>
      <div>
        <Link href={config.referralUrl}>
          <Image src={FoxieIcon} alt="Foxie" width={20} height={20} />
        </Link>
      </div>
    </header>
  )
}
