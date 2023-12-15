import React from 'react';
import Image from 'next/image';

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center w-full mt-8">
      {/* Santa Image */}
      <div className="m-1">
        <Image src="/images/santa-svg.svg" alt="Santa Image" width={450} height={400} />
      </div>
      {/* Coming Soon Image */}
      <div className="">
        <Image src="/images/coming-soon-sticker.svg" alt="Coming Soon..." width={800} height={500} />
      </div>
    </div>
  );
};

export default ComingSoon;
