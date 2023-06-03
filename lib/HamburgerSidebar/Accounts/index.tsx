'use client';

import { faDoorClosed, faUser } from '@fortawesome/free-solid-svg-icons';
import RenderButtonComponent from '../RenderButtonComponent';
import { useClerk } from '@clerk/clerk-react';

const Accounts = ({ email }: { email: string }) => {
  const { signOut } = useClerk();

  return (
    <section className="flex flex-col gap-2">
      <h6 className="flex gap-2 items-center text-gray-600 text-xs font-medium">
        ACCOUNTS <hr className="w-full h-[2px] bg-gray-600" />
      </h6>
      <section className="flex flex-col gap-2 font-medium text-onPrimaryContainer">
        <section className="flex flex-col gap-0">
          <p className="text-sm font-base">Logged in as</p>
          <p>{email}</p>
        </section>
        <RenderButtonComponent
          icon={faUser}
          text="Edit Account"
          href="/app/accounts"
          type="anchor"
        />
        <RenderButtonComponent
          icon={faDoorClosed}
          text="Log out"
          type="button"
          handleClick={() => signOut()}
        />
      </section>
    </section>
  );
};

export default Accounts;
