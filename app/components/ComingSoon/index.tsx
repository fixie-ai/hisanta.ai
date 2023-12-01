import React from 'react';
import Image from 'next/image';

const ComingSoon = () => {
  return (
    <div className="flex flex-col w-full mt-4">
      {/* Santa Image */}
      <div className="m-1">
        <Image src="/images/santa-svg.svg" alt="Santa Image" width={500} height={500} />
      </div>
      {/* Text */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">Coming Soon</h1>
      </div>
      
    </div>
    
  );
};

export default ComingSoon;