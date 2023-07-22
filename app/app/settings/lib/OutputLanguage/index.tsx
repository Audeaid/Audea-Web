'use client'

import { Check, ChevronsUpDown, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import cn from '@/utils/cn'
import { useState } from 'react'
import { outputLanguageListWithAsk } from '@/app/data/outputLanguage'
import { updateContentSettings } from '../script'
import toast from 'react-hot-toast'
import ErrorToast from '@/components/ErrorToast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function OutputLanguage({ token, initialValue }: { token: string; initialValue: string }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(outputLanguageListWithAsk.find(({ db }) => initialValue === db)?.value ?? '')

  return (
    <section className='flex flex-col gap-6'>
      <section className='flex md:flex-row md:items-start md:justify-between flex-col gap-4 flex-wrap'>
        <section className='flex flex-col gap-2'>
          <h3 className='text-2xl font-medium'>Output Language</h3>
          <p className='md:max-w-full max-w-[365px]'>Change the written content language based on your preferences.</p>
        </section>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' role='combobox' aria-expanded={open} className='w-[250px] justify-between'>
              {value
                ? outputLanguageListWithAsk.find((language) => language.value === value)?.label
                : 'Select language...'}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[250px] p-0'>
            <Command>
              <CommandInput placeholder='Search language...' />
              <CommandEmpty>Language is not yet supported.</CommandEmpty>
              <CommandGroup>
                {outputLanguageListWithAsk.map((language) => (
                  <CommandItem
                    className={cn(
                      language.db === 'ASK' ? 'dark:bg-blue-900 bg-blue-200' : '',
                      language.db === 'TRANSCRIPT' ? 'dark:bg-green-900 bg-green-200' : '',
                    )}
                    key={language.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue)

                      const db = outputLanguageListWithAsk.find(({ value }) => currentValue === value)?.db as string

                      setOpen(false)

                      toast
                        .promise(
                          updateContentSettings({
                            token,
                            writingStyle: null,
                            outputLanguage: db,
                            typeOfPromptId: null,
                          }),
                          {
                            loading: 'Saving your settings...',
                            success: 'Settings saved!',
                            error: 'Error saving your settings!',
                          },
                        )
                        .catch((e) => {
                          ErrorToast('saving output language', e)
                        })
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', value === language.value ? 'opacity-100' : 'opacity-0')} />
                    {language.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </section>

      <Alert>
        <Megaphone className='h-4 w-4' />
        <AlertTitle className={cn('text-orange-400 font-bold')}>Caution!</AlertTitle>
        <AlertDescription>
          If you set{' '}
          <code className='px-2 py-0.5 rounded-md dark:bg-green-900 bg-green-200 text-sm'>Same as transcript</code> but
          in your transcript you mixed English with other languages, the AI has a tendency to produce content in
          English.
        </AlertDescription>
      </Alert>
    </section>
  )
}
