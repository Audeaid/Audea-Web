'use client';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import LogoSecondary from '$public/logo/secondary.svg';
import Image from 'next/image';

const Header = () => {
  return (
    <>
      <motion.nav
        className="w-full lg:flex hidden justify-end items-center h-[100px] px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <section className="font-medium flex items-center justify-center w-fit h-fit gap-2">
          <p>Already have an account? </p>

          <a href="/login">
            <button className="text-primaryDark flex items-center justify-center text-base gap-1">
              Login
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </a>
        </section>
      </motion.nav>

      <motion.nav
        className="w-full h-fit sm:px-20 sm:py-10 px-4 py-6 lg:hidden flex sm:flex-row flex-col justify-between items-center select-none gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <a href="/">
          <Image
            src={LogoSecondary}
            alt="Audea Logo"
            width={120}
            quality={100}
            draggable={false}
          />
        </a>

        <section className="font-medium flex items-center justify-center w-fit h-fit gap-2">
          <p>Already have an account? </p>

          <a href="/login">
            <button className="text-primaryDark flex items-center justify-center text-base gap-1">
              Login
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </a>
        </section>
      </motion.nav>
    </>
  );
};

export default Header;
