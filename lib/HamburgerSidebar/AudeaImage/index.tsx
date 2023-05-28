'use client';

import Image from 'next/image';
import LogoPrimary from '$public/logo/primary.svg';

const AudeaImage = () => {
  return (
    <a href="/app" className="w-fit h-fit">
      <Image
        src={LogoPrimary}
        alt="Audea Logo"
        height={30}
        quality={100}
        draggable={false}
      />
    </a>
  );
};

export default AudeaImage;
