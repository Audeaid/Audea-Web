'use client';

import { outputLanguageList } from '@/app/utils/outputLanguage';
import { prompt } from '@/app/utils/typeOfPrompt';
import { Separator } from '@/components/ui/separator';

export default function Footer({
  outputLanguage,
  writingStyle,
  typeOfPromptId,
}: {
  outputLanguage: string;
  writingStyle: string;
  typeOfPromptId: string;
}) {
  return (
    <footer className="flex flex-col gap-4 select-none">
      <Separator />

      <section className="flex justify-between items-center flex-wrap text-sm text-muted-foreground gap-2">
        <p>
          Output language:{' '}
          {outputLanguageList.find((v) => v.db === outputLanguage)?.label}
        </p>

        <p>Writing style: {writingStyle}</p>

        <p>
          Type of prompt: {prompt.find((v) => v.id === typeOfPromptId)?.name}
        </p>
      </section>
    </footer>
  );
}
