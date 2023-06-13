import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Client from './lib';
import { signJwt } from '@/utils/jwt';
import { checkIfVoted, getPlatformVote } from './graphql';

export default async function Page() {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) redirect('/login');

  const token = signJwt(clerkUserId);

  try {
    const iOSVote = await getPlatformVote(token, 'IOS');
    const iOSIsVoted = await checkIfVoted(token, 'IOS');

    const iPadOSVote = await getPlatformVote(token, 'IPADOS');
    const iPadOSIsVoted = await checkIfVoted(token, 'IPADOS');

    const macOSVote = await getPlatformVote(token, 'MACOS');
    const macOSIsVoted = await checkIfVoted(token, 'MACOS');

    const androidVote = await getPlatformVote(token, 'ANDROID');
    const androidIsVoted = await checkIfVoted(token, 'ANDROID');

    const androidTabletVote = await getPlatformVote(token, 'ANDROIDTABLET');
    const androidTabletIsVoted = await checkIfVoted(token, 'ANDROIDTABLET');

    const windowsVote = await getPlatformVote(token, 'WINDOWS');
    const windowsIsVoted = await checkIfVoted(token, 'WINDOWS');

    const linuxVote = await getPlatformVote(token, 'LINUX');
    const linuxIsVoted = await checkIfVoted(token, 'LINUX');

    return (
      <Client
        token={token}
        initialIOSCount={iOSVote.count}
        isCheckedIOS={iOSIsVoted.voted}
        initialIPadOSCount={iPadOSVote.count}
        isCheckedIPadOS={iPadOSIsVoted.voted}
        initialMacOSCount={macOSVote.count}
        isCheckedMacOS={macOSIsVoted.voted}
        initialAndroidCount={androidVote.count}
        isCheckedAndroid={androidIsVoted.voted}
        initialAndroidTabletCount={androidTabletVote.count}
        isCheckedAndroidTablet={androidTabletIsVoted.voted}
        initialWindowsCount={windowsVote.count}
        isCheckedWindows={windowsIsVoted.voted}
        initialLinuxCount={linuxVote.count}
        isCheckedLinux={linuxIsVoted.voted}
      />
    );
  } catch (error) {
    const e = JSON.stringify(error);
    console.log(JSON.parse(e));
  }
}
