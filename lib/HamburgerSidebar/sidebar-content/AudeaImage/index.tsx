'use client';

import Image from 'next/image';
import LogoTextBlack from '$public/logo/logo_text_black.svg';

export const AudeaImage = () => {
  return (
    <a href="/app" className="w-fit h-fit">
      <Image
        src={LogoTextBlack}
        alt="Audea Logo"
        height={30}
        quality={100}
        draggable={false}
      />
    </a>
  );
};
