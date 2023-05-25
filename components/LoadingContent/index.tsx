'use client';

import AddLottieAnimation from '../AddLottieAnimation';
import type { ILoadingContent } from './index.d';

const LoadingContent: React.FC<ILoadingContent> = ({ condition }) => {
  return (
    <section className="w-full h-fit border-dashed border-2 border-primaryDark rounded-xl py-20 max-w-[800px] mx-auto relative sm:px-0 px-4 bg-gray-900 flex flex-col items-center justify-center mt-10">
      <div className="max-w-[500px]">
        <AddLottieAnimation
          path="/lottie/9844-loading-40-paperplane.json"
          loop={true}
        />
      </div>
      <p className="font-bold sm:text-2xl text-lg text-center">{condition}</p>
    </section>
  );
};

export default LoadingContent;
