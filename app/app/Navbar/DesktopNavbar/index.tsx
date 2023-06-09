'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import DarkModeSwitch from '../DarkModeSwitch';
import MenuDropdown from './MenuDropdown';
import Navigation from './Navigation';

const DesktopNavbar = ({
  router,
  token,
}: {
  router: AppRouterInstance;
  token: string;
}) => {
  return (
    <nav className="w-full h-fit justify-between items-center max-w-[1300px] mx-auto gap-10 px-4 my-10 md:flex hidden">
      <MenuDropdown router={router} token={token} />

      <Navigation router={router} token={token} />

      <DarkModeSwitch />
    </nav>
  );
};

export default DesktopNavbar;
