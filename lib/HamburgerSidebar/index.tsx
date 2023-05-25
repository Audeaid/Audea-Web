'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AudeaImage, Workspace, Resources, Accounts } from './sidebar-content';
import { useRouter } from 'next/navigation';
import { getUserInfo, getUserSubscription } from './api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

const HamburgerSidebar = ({ token }: { token: string }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [email, setEmail] = useState('');
  const [subscriptionType, setSubscriptionType] = useState<
    'TRIAL' | 'MONTHLY' | 'LIFETIME' | 'YEARLY' | 'EARLYADOPTER'
  >('TRIAL');

  useEffect(() => {
    (async () => {
      try {
        const userInfo = await getUserInfo(token);
        const userSubscription = await getUserSubscription(token);

        setEmail(userInfo.email);
        setStartDate(userSubscription.startDate);
        setEndDate(userSubscription.endDate);
        setSubscriptionType(userSubscription.type);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [token]);

  return (
    <aside className="select-none">
      <button
        className="block z-50 p-2 rounded-md text-onPrimaryDark bg-primaryDark"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      <motion.aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } h-full shadow-inner flex flex-col gap-10 p-4`}
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar content goes here */}
        <section className="flex justify-between items-center">
          <AudeaImage />
          <a href="/app" className="w-fit h-fit">
            <button
              className="bg-tertiary text-onPrimary font-medium text-sm px-4 py-1 rounded-lg shadow-xl flex items-center gap-2"
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={faMicrophone} />
              Record
            </button>
          </a>
        </section>
        <section className="flex flex-col gap-8">
          <Workspace
            startDate={startDate}
            endDate={endDate}
            subscriptionType={subscriptionType}
          />
          <Resources />
          <Accounts email={email} router={router} />
        </section>
      </motion.aside>

      {isOpen && (
        <motion.div
          className={`fixed inset-0 bg-black/40 ${isOpen ? 'z-30' : 'z-0'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </aside>
  );
};

export default HamburgerSidebar;
