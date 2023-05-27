'use client';

import { motion } from 'framer-motion';
import LogoSecondary from '$public/logo/secondary.svg';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <motion.nav
      className="w-full h-fit sm:px-20 sm:py-10 px-4 py-6 flex sm:flex-row flex-col justify-between items-center select-none gap-4"
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
        <p>Not meant to reset your password? </p>

        <a href="/login">
          <button className="text-primaryDark flex items-center justify-center text-base gap-1">
            Login
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </a>
      </section>
    </motion.nav>
  );
};

export default Header;
