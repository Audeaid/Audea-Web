'use client'

import AddLottieAnimation from '@/components/AddLottieAnimation'
import type { ILoadingContent } from './index.d'

export default function LoadingContent({ condition }: ILoadingContent) {
  return (
    <section className='w-full h-fit border-dashed border-2 border-border rounded-xl py-20 max-w-[800px] mx-auto relative sm:px-0 px-4 dark:bg-gray-900 bg-gray-100 flex flex-col items-center justify-center mt-10'>
      <div className='max-w-[500px]'>
        <AddLottieAnimation
          animationConfig={{
            path: '/lottie/9844-loading-40-paperplane.json',
            loop: true,
            autoplay: true,
          }}
        />
      </div>
      <p className='font-bold sm:text-2xl text-lg text-center'>{condition}</p>
      <p className='text-sm text-center'>Please do not close this window!</p>
    </section>
  )
}
