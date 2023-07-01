'use client';

import AddLottieAnimation from '@/components/AddLottieAnimation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
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
          You haven&apos;t saved any notes.
        </p>
        <Button
          onClick={() => {
            router.push('/app');
          }}
          type="button"
          variant="default"
        >
          <Mic className="mr-2 w-4 h-4" />
          Go make one!
        </Button>

        <p>
          Not sure how?{' '}
          <a className="text-blue-500" href="/app/how-audea-works">
            See how to use Audea.
          </a>
        </p>
      </section>
    </motion.section>
  );
};

export default EmptyContent;
