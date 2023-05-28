'use client';

import AddLottieAnimation from '@/components/AddLottieAnimation';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { deleteContent } from './script';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

const ErrorShouldDelete = ({
  token,
  contentId,
  router,
}: {
  token: string;
  contentId: string;
  router: AppRouterInstance;
}) => {
  return (
    <motion.section
      className="flex flex-col gap-4 w-fit mx-auto items-center justify-center select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-[500px] w-fit">
        <AddLottieAnimation path={'/lottie/53034-lost.json'} loop={true} />
      </div>
      <section className="mt-[-5rem] flex flex-col gap-12 items-center justify-center">
        <section className="flex flex-col gap-2 max-w-[600px]">
          <p className="font-bold text-xl text-center text-primaryDark">
            Sorry, it seems like there is a uncoverable error on our end that
            makes your audio cannot be processed.
          </p>
          <p className="text-center font-light">
            It is very rare that we have an error like this and we are deeply
            sorry that this error happen to you.
          </p>
          <p className="text-left font-light text-xs">
            <span className="font-medium">Side note</span>: Please make sure
            that when we are processing your audio file, do not close the
            browser at any time, since it will interrupt the process.
          </p>
        </section>
        <button
          onClick={async () => {
            await deleteContent(token, contentId);
            router.push('/app/saved');
          }}
          className="px-4 py-1 rounded-md shadow-xl text-lg bg-errorDark text-onErrorDark w-fit flex items-center justify-center gap-4 text-left"
          type="button"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Delete this content and go back
        </button>
      </section>
    </motion.section>
  );
};

export default ErrorShouldDelete;
