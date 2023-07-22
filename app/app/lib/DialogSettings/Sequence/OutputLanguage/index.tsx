'use client';

import { Dispatch, SetStateAction } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import cn from '@/utils/cn';
import { useState } from 'react';
import { outputLanguageList } from '@/app/data/outputLanguage';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const OutputLanguage = ({
  value,
  setValue,
  setValueDb,
  saved,
  setSaved,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  setValueDb: Dispatch<SetStateAction<string>>;
  saved: boolean;
  setSaved: Dispatch<SetStateAction<boolean>>;
}) => {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(value);
  const [checked, setChecked] = useState(saved ?? false);

  return (
    <section className="flex flex-col gap-8">
      <p>
        Choose from a diverse range of languages to ensure your transformed
        content resonates effortlessly with you.
      </p>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between"
          >
            {val
              ? outputLanguageList.find((language) => language.value === val)
                  ?.label
              : 'Select language...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search language..." />
            <CommandEmpty>Language is not yet supported.</CommandEmpty>
            <CommandGroup>
              {outputLanguageList.map((language) => (
                <CommandItem
                  key={language.value}
                  onSelect={(currentValue) => {
                    setVal(currentValue === val ? '' : currentValue);

                    const db = outputLanguageList.find(
                      ({ value }) => currentValue === value
                    )?.db as string;

                    setValue(currentValue === val ? '' : currentValue);

                    setValueDb(currentValue === val ? '' : db);

                    if (currentValue === val) {
                      setChecked(false);
                    }

                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      val === language.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Alert>
        <Megaphone className="h-4 w-4" />
        <AlertTitle className={cn('text-orange-400 font-bold')}>
          Caution!
        </AlertTitle>
        <AlertDescription>
          If you set{' '}
          <code className="px-2 py-0.5 rounded-md dark:bg-green-900 bg-green-200 text-sm">
            Same as transcript
          </code>{' '}
          but in your transcript you mixed English with other languages, the AI
          has a tendency to produce content in English.
        </AlertDescription>
      </Alert>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="save"
          onCheckedChange={(v) => {
            if (v) {
              setChecked(true);
              setSaved(true);
            } else {
              setChecked(false);
              setSaved(false);
            }
          }}
          checked={checked}
          disabled={!val}
        />
        <Label
          htmlFor="save"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Don&apos;t ask me next time
        </Label>
      </div>
    </section>
  );
};
