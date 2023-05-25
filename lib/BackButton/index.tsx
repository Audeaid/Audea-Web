'use client';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

const BackButton = ({ href }: { href: string }) => {
  return (
    <motion.section
      className="w-full h-fit flex items-center justify-start max-w-[1300px] mx-auto py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <a href={href}>
        <button className="flex items-center gap-2 font-bold text-lg bg-white text-onPrimaryContainer shadow-xl px-4 py-1 rounded-lg">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>
      </a>
    </motion.section>
  );
};

export default BackButton;
