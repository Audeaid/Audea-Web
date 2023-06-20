'use client';

export const CountingDown = ({ countdown }: { countdown: number | string }) => {
  return (
    <section className="flex gap-2 font-bold text-3xl">
      <p>
        Recording{' '}
        <span
          className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px] bg-red-700 rounded-full"
          style={{ display: 'inline-block' }}
        />{' '}
      </p>
      <p>starts in {countdown}</p>
    </section>
  );
};
