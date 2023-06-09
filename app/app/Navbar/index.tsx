'use client';

import { ViewportContext } from '@/context/Viewport';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';

const Navbar = ({ token }: { token: string }) => {
  const router = useRouter();

  const { isMobile } = useContext(ViewportContext);

  if (isMobile) {
    return <MobileNavbar router={router} token={token} />;
  } else {
    return <DesktopNavbar router={router} token={token} />;
  }
};

export default Navbar;
