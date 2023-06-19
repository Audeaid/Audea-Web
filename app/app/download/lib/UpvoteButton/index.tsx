'use client';

import { motion, useMotionValue } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { ChangeEventHandler } from 'react';

const UpvoteButton = ({
  checked,
  animate,
  handleChange,
}: {
  checked: boolean;
  animate: boolean;
  handleChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <div className="w-fit h-fit rounded-md shadow-lg flex items-center justify-center select-none bg-foreground text-background text-base overflow-hidden">
      <motion.label
        className={`w-fit h-fit flex items-center justify-center cursor-pointer px-3 py-1  ${
          checked ? 'bg-green-500' : 'bg-foreground'
        } gap-2 font-bold select-none rounded-md`}
        animate={{ opacity: 1 }}
        onTap={(_event, info) => {
          x.set(info.point.x);
          y.set(info.point.y);
        }}
        onMouseEnter={(e) => {
          x.set(e.clientX);
          y.set(e.clientY);
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        <ChevronUp className="w-5 h-5" />
        <p>Upvote</p>
      </motion.label>

      {animate && (
        <>
          <motion.div
            className="w-fit h-fit z-20 sm:text-6xl text-4xl select-none"
            style={{
              inset: 0,
              x: x.get(),
              y: y.get(),
              position: 'fixed',
            }}
            animate={{
              y: y.get() - 100,
              opacity: [0, 1, 0],
              rotate: 45,
            }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            🔥
          </motion.div>
          <motion.div
            className="w-fit h-fit z-20 sm:text-6xl text-4xl select-none"
            style={{
              inset: 0,
              x: x.get() + 40,
              y: y.get(),
              position: 'fixed',
            }}
            animate={{
              y: y.get() - 80,
              opacity: [0, 1, 0],
              rotate: -80,
            }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            🎉
          </motion.div>
          <motion.div
            className="w-fit h-fit z-20 sm:text-6xl text-4xl select-none"
            style={{
              inset: 0,
              x: x.get() - 50,
              y: y.get(),
              position: 'fixed',
            }}
            animate={{
              y: y.get() - 70,
              opacity: [0, 1, 0],
              rotate: -100,
            }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            🤯
          </motion.div>
        </>
      )}
    </div>
  );
};

export default UpvoteButton;
