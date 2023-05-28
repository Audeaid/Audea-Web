'use client';

import { faDoorClosed, faUser } from '@fortawesome/free-solid-svg-icons';
import RenderButtonComponent from '../RenderButtonComponent';
import cookieCutter from 'cookie-cutter';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

const Accounts = ({
  email,
  router,
}: {
  email: string;
  router: AppRouterInstance;
}) => {
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
          href="#"
          type="anchor"
        />
        <RenderButtonComponent
          icon={faDoorClosed}
          text="Log out"
          type="button"
          handleClick={(e) => {
            e.preventDefault();
            cookieCutter.set('audea_token', '', { expires: new Date(0) });
            cookieCutter.set('audea_signInProvider', '', {
              expires: new Date(0),
            });
            router.push('/login');
          }}
        />
      </section>
    </section>
  );
};

export default Accounts;
