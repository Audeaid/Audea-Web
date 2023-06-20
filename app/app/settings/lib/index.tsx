'use client';

import { IGetContentSettings } from '../graphql';
import { motion } from 'framer-motion';
import WritingStyle from './WritingStyle';
import OutputLanguage from './OutputLanguage';
import { Separator } from '@/components/ui/separator';
import SelectPrompt from './SelectPrompt';
import DangerZone from './DangerZone';

export default function Client({
  contentSettings,
  token,
}: {
  contentSettings: IGetContentSettings;
  token: string;
}) {
  return (
    <motion.section
      className={`flex flex-col gap-20 select-none pb-20`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className="w-full flex sm:flex-row flex-col sm:items-center h-fit sm:justify-between sm:gap-0 gap-4">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">Workspace Settings</h1>
          <p>Change your workspace preferences</p>
        </header>
      </section>

      <section className="flex flex-col gap-10">
        <OutputLanguage
          token={token}
          initialValue={contentSettings.outputLanguage}
        />

        <Separator />

        <WritingStyle
          token={token}
          initialValue={contentSettings.writingStyle}
        />

        <Separator />

        <SelectPrompt
          token={token}
          initialValue={contentSettings.typeOfPromptId}
        />
      </section>

      <DangerZone token={token} />
    </motion.section>
  );
}
