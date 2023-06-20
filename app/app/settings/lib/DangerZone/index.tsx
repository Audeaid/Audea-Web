'use client';

import DeleteAllContent from './components/DeleteAllContent';

export default function DangerZone({ token }: { token: string }) {
  return (
    <section className="p-8 rounded-lg border-2 border-dashed dark:border-red-800 border-red-500 flex flex-col gap-10">
      <h6 className="text-3xl font-bold dark:text-red-800 text-red-500">
        Danger zone
      </h6>

      <section className="flex flex-col gap-10">
        <DeleteAllContent token={token} />
      </section>
    </section>
  );
}
