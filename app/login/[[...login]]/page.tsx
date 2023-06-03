'use client';

import { useState } from 'react';
import { SignIn, useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
  return <SignIn />;
  // const { isLoaded, signIn, setActive } = useSignIn();
  // const [emailAddress, setEmailAddress] = useState('');
  // const [password, setPassword] = useState('');
  // const router = useRouter();
  // // start the sign In process.
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!isLoaded) {
  //     return;
  //   }

  //   try {
  //     const result = await signIn.create({
  //       identifier: emailAddress,
  //     });

  //     console.log(result.supportedFirstFactors);

  //     // if (result.status === 'complete') {
  //     //   console.log(result);
  //     //   // await setActive({ session: result.createdSessionId });
  //     //   // router.push('/');
  //     // } else {
  //     //   /*Investigate why the login hasn't completed */
  //     //   console.log(result);
  //     // }
  //   } catch (err: any) {
  //     console.error('error', err.errors[0].longMessage);
  //   }
  // };

  // return (
  //   <div>
  //     <form>
  //       <div>
  //         <label htmlFor="email">Email</label>
  //         <input
  //           onChange={(e) => setEmailAddress(e.target.value)}
  //           className="text-onPrimaryContainer"
  //           id="email"
  //           name="email"
  //           type="email"
  //         />
  //       </div>

  //       <button onClick={handleSubmit}>Sign In</button>
  //     </form>
  //   </div>
  // );
}

const test = {
  pathRoot: '/me',
  id: 'user_2QcBTBfBfwUjmOAW99uvOrbHyuY',
  externalId: null,
  username: null,
  emailAddresses: [
    {
      pathRoot: '/me/email_addresses',
      emailAddress: 'audeaindonesia@gmail.com',
      linkedTo: [],
      id: 'idn_2QcBRPE7lkHeusyIOkvRjDOWr7J',
      verification: {
        pathRoot: '',
        status: 'verified',
        strategy: 'email_code',
        nonce: null,
        externalVerificationRedirectURL: null,
        attempts: 1,
        expireAt: '2023-06-01T18:19:41.260Z',
        error: null,
      },
    },
  ],
  phoneNumbers: [],
  web3Wallets: [],
  externalAccounts: [],
  samlAccounts: [],
  organizationMemberships: [],
  passwordEnabled: true,
  firstName: 'Audea',
  lastName: 'Indonesia',
  fullName: 'Audea Indonesia',
  primaryEmailAddressId: 'idn_2QcBRPE7lkHeusyIOkvRjDOWr7J',
  primaryEmailAddress: {
    pathRoot: '/me/email_addresses',
    emailAddress: 'audeaindonesia@gmail.com',
    linkedTo: [],
    id: 'idn_2QcBRPE7lkHeusyIOkvRjDOWr7J',
    verification: {
      pathRoot: '',
      status: 'verified',
      strategy: 'email_code',
      nonce: null,
      externalVerificationRedirectURL: null,
      attempts: 1,
      expireAt: '2023-06-01T18:19:41.260Z',
      error: null,
    },
  },
  primaryPhoneNumberId: null,
  primaryPhoneNumber: null,
  primaryWeb3WalletId: null,
  primaryWeb3Wallet: null,
  profileImageUrl: 'https://www.gravatar.com/avatar?d=mp',
  imageUrl:
    'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yUVhFR2FvT0Z1Umd0bjN5Unl3d0xSbjc5N3UiLCJyaWQiOiJ1c2VyXzJRY0JUQmZCZndVam1PQVc5OXV2T3JiSHl1WSIsImluaXRpYWxzIjoiQUkifQ',
  twoFactorEnabled: false,
  totpEnabled: false,
  backupCodeEnabled: false,
  publicMetadata: {},
  unsafeMetadata: {},
  lastSignInAt: '2023-06-01T19:32:21.712Z',
  updatedAt: '2023-06-01T19:32:21.770Z',
  createdAt: '2023-06-01T18:09:54.918Z',
  cachedSessionsWithActivities: null,
};
