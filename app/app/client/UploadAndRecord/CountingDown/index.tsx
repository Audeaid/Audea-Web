'use client'

interface Props {
  countdown: number | string
}

export default function CountingDown({ countdown }: Props) {
  return (
    <section className='flex gap-2 font-bold sm:text-3xl text-xl w-fit mx-auto py-10'>
      <p className='text-center'>
        Recording{' '}
        <span
          className='min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px] bg-red-700 rounded-full'
          style={{ display: 'inline-block' }}
        />{' '}
        starts in {countdown}
      </p>
    </section>
  )
}
