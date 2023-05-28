'use client';

import AddLottieAnimation from '@/components/AddLottieAnimation';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

const EmptyContent = ({ router }: { router: AppRouterInstance }) => {
  return (
    <motion.section
      className="flex flex-col gap-4 w-fit mx-auto items-center justify-center select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-[500px] w-fit">
        <AddLottieAnimation
          path={'/lottie/75212-cat-loader.json'}
          loop={true}
        />
      </div>
      <section className="flex flex-col gap-12 items-center justify-center">
        <p className="font-bold text-xl text-center text-primaryDark max-w-[600px]">
          There is no content.
        </p>
        <button
          onClick={() => {
            router.push('/app');
          }}
          className="px-4 py-1 rounded-md shadow-xl text-lg bg-primaryDark text-onPrimaryDark w-fit flex items-center justify-center gap-4 text-left"
          type="button"
        >
          <FontAwesomeIcon icon={faMicrophone} />
          Go make one!
        </button>
      </section>
    </motion.section>
  );
};

export default EmptyContent;
