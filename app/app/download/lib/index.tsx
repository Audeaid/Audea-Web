'use client';

import VoteAndroid from './VoteAndroid';
import VoteAndroidTablet from './VoteAndroidTablet';
import VoteIOS from './VoteIOS';
import VoteIPadOS from './VoteIPadOS';
import VoteLinux from './VoteLinux';
import VoteMacOS from './VoteMacOS';
import VoteWindows from './VoteWindows';
import { motion } from 'framer-motion';
import InstallButton from '@/components/InstallButton';

export default function Client({
  token,
  initialIOSCount,
  isCheckedIOS,

  initialIPadOSCount,
  isCheckedIPadOS,

  initialMacOSCount,
  isCheckedMacOS,

  initialAndroidCount,
  isCheckedAndroid,

  initialAndroidTabletCount,
  isCheckedAndroidTablet,

  initialWindowsCount,
  isCheckedWindows,

  initialLinuxCount,
  isCheckedLinux,
}: {
  token: string;
  initialIOSCount: number;
  isCheckedIOS: boolean;

  initialIPadOSCount: number;
  isCheckedIPadOS: boolean;

  initialMacOSCount: number;
  isCheckedMacOS: boolean;

  initialAndroidCount: number;
  isCheckedAndroid: boolean;

  initialAndroidTabletCount: number;
  isCheckedAndroidTablet: boolean;

  initialWindowsCount: number;
  isCheckedWindows: boolean;

  initialLinuxCount: number;
  isCheckedLinux: boolean;
}) {
  return (
    <motion.section
      className="flex flex-col gap-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col gap-4 select-none">
        <h1 className="font-bold text-4xl">Download app</h1>

        <p className="text-base font-light text-justify">
          Audea is currently available as a web version, which you can easily
          install as a Progressive Web App (PWA). However, we have exciting
          plans to develop an app specifically for your platform. Make your
          voice heard by casting your vote below!
        </p>

        <InstallButton />
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="grid lg:grid-cols-4 lg:grid-rows-2 md:grid-cols-3 md:grid-rows-3 sm:grid-cols-2 sm:grid-rows-4 grid-cols-1 grid-rows-7 justify-items-center gap-4 w-fit h-fit">
          <VoteIOS
            token={token}
            initialCount={initialIOSCount}
            isChecked={isCheckedIOS}
          />

          <VoteAndroid
            token={token}
            initialCount={initialAndroidCount}
            isChecked={isCheckedAndroid}
          />

          <VoteMacOS
            token={token}
            initialCount={initialMacOSCount}
            isChecked={isCheckedMacOS}
          />

          <VoteWindows
            token={token}
            initialCount={initialWindowsCount}
            isChecked={isCheckedWindows}
          />

          <VoteIPadOS
            token={token}
            initialCount={initialIPadOSCount}
            isChecked={isCheckedIPadOS}
          />

          <VoteAndroidTablet
            token={token}
            initialCount={initialAndroidTabletCount}
            isChecked={isCheckedAndroidTablet}
          />

          <VoteLinux
            token={token}
            initialCount={initialLinuxCount}
            isChecked={isCheckedLinux}
          />
        </div>
        <p className="text-sm text-muted-foreground font-light">
          Pssh, this vote is using live data!
        </p>
      </div>
    </motion.section>
  );
}
