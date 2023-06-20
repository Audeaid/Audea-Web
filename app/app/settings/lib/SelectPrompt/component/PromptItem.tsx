'use client';

import { Check } from 'lucide-react';
import { useMutationObserver } from '@/hooks/useMutationObserver';
import { CommandItem } from '@/components/ui/command';
import cn from '@/utils/cn';
import { Prompt } from '../../../../../utils/typeOfPrompt';
import { useRef } from 'react';

export interface ModelItemProps {
  prompt: Prompt;
  isSelected: boolean;
  onSelect: () => void;
  onPeek: (_prompt: Prompt) => void;
}

export function PromptItem({
  prompt,
  isSelected,
  onSelect,
  onPeek,
}: ModelItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations: any) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        if (mutation.attributeName === 'aria-selected') {
          onPeek(prompt);
        }
      }
    }
  });

  return (
    <CommandItem
      key={prompt.id}
      onSelect={onSelect}
      ref={ref}
      className="aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      {prompt.name}
      <Check
        className={cn(
          'ml-auto h-4 w-4',
          isSelected ? 'opacity-100' : 'opacity-0'
        )}
      />
    </CommandItem>
  );
}
