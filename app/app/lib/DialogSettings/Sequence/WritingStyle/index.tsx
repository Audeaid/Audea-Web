'use client';

import { Dispatch, SetStateAction } from 'react';
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { presets } from '@/app/data/presets';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronsUpDown, Megaphone } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export const WritingStyle = ({
  value,
  setValue,
  saved,
  setSaved,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  saved: boolean;
  setSaved: Dispatch<SetStateAction<boolean>>;
}) => {
  const [val, setVal] = useState(value === 'Default' ? 'Default' : 'custom');
  const [customVal, setCustomVal] = useState(value === 'Default' ? '' : value);
  const [checked, setChecked] = useState(saved ?? false);

  const [open, setOpen] = useState(false);

  return (
    <section className="flex flex-col gap-8">
      <p>
        Make the AI to write in any style you want. You can go crazy customizing
        it, you can also choose our presets, or, you can just use the default
        writing style.
      </p>

      <section className="flex flex-col gap-4">
        {val === 'custom' && (
          <section className="flex flex-col gap-2">
            <Input
              placeholder="Write like shakespeare"
              value={customVal}
              onChange={(e) => {
                setCustomVal(e.currentTarget.value);
                setValue(e.currentTarget.value);
              }}
              required={true}
              name="custom-value"
            />

            <div className="flex items-center justify-between gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Load a preset..."
                    aria-expanded={open}
                    className="flex-1 justify-between"
                  >
                    Load a preset...
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full max-w-[350px] p-0">
                  <Command>
                    <CommandInput placeholder="Search presets..." />
                    <CommandEmpty>No presets found.</CommandEmpty>
                    <CommandGroup heading="Examples">
                      {presets.map((preset, id) => (
                        <CommandItem
                          key={id}
                          onSelect={() => {
                            setCustomVal(preset);
                            setValue(preset);
                            setOpen(false);
                          }}
                        >
                          {preset}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </section>
        )}

        <RadioGroup
          defaultValue={val}
          onValueChange={(value) => {
            setVal(value);
            setCustomVal('');

            if (value !== 'custom') {
              setValue(value);
            }
          }}
          className={cn(
            val === 'custom' ? 'flex items-center gap-2' : 'grid gap-2'
          )}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Default" id="r1" />
            <Label htmlFor="r1">Default</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="r2" />
            <Label htmlFor="r2">Custom</Label>
          </div>
        </RadioGroup>
      </section>

      <Alert>
        <Megaphone className="h-4 w-4" />
        <AlertTitle className={cn('text-orange-400 font-bold')}>
          Caution!
        </AlertTitle>
        <AlertDescription>
          Writing style is not 100% effective if the output language is not
          English.
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
          disabled={val === 'custom' && !customVal}
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
