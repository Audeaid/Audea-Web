'use client';

import { useEffect, useRef, useState } from 'react';
import type { LottiePlayer } from 'lottie-web';

const AddLottieAnimation = ({
  path,
  loop,
}: {
  path: string;
  loop: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import('lottie-web').then((Lottie) => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        loop,
        autoplay: true,
        // path to your animation file, place it inside public folder
        path,
      });

      return () => animation.destroy();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lottie, path]);

  return <div className="w-full h-fit" ref={ref} />;
};

export default AddLottieAnimation;
