'use client';

import { faArrowLeft, faBoxesPacking } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { MouseEventHandler } from 'react';

const BackButton = ({
  href,
  withAction,
  handleAction,
}: {
  href: string;
  withAction?: boolean;
  handleAction?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <motion.section
      className={`w-full h-fit flex items-center ${
        withAction ? 'justify-between' : 'justify-start'
      } justify-start max-w-[1300px] mx-auto py-4 select-none`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <a href={href}>
        <button
          className="flex items-center gap-2 font-bold text-lg bg-white text-onPrimaryContainer shadow-xl px-4 py-1 rounded-lg"
          tabIndex={-1}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>
      </a>

      {withAction && (
        <button
          className="flex items-center gap-2 font-bold text-lg bg-tertiaryContainerDark text-onTertiaryContainerDark shadow-xl px-4 py-1 rounded-lg"
          onClick={handleAction}
        >
          Show actions
          <FontAwesomeIcon icon={faBoxesPacking} />
        </button>
      )}
    </motion.section>
  );
};

export default BackButton;
