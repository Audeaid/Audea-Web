'use client'

import { ChevronsUpDown, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import cn from '@/utils/cn'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { presets } from '@/app/data/presets'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import toast from 'react-hot-toast'
import { updateContentSettings } from '../script'
import ErrorToast from '@/components/ErrorToast'

interface Props {
  token: string
  initialValue: string
}

export default function WritingStyle({ token, initialValue }: Props) {
  const [value, setValue] = useState(initialValue === 'ASK' || initialValue === 'Default' ? initialValue : 'custom')

  const [customValue, setCustomValue] = useState(
    initialValue === 'ASK' || initialValue === 'Default' ? '' : initialValue,
  )

  const [open, setOpen] = useState(false)

  return (
    <section className='flex flex-col gap-6'>
      <section className='flex md:flex-row md:items-start md:justify-between flex-col gap-4 flex-wrap'>
        <section className='flex flex-col gap-2'>
          <h3 className='text-2xl font-medium'>Writing style</h3>
          <p className='md:max-w-full max-w-[365px]'>Make the AI write in any style you want.</p>
        </section>

        <section className='flex flex-col gap-4'>
          {value === 'custom' && (
            <form
              className='flex flex-col gap-2'
              onSubmit={(e) => {
                e.preventDefault()

                const formData = new FormData(e.currentTarget)

                const customValueForm = formData.get('custom-value')

                if (!customValueForm) return

                toast
                  .promise(
                    updateContentSettings({
                      token,
                      writingStyle: customValueForm.toString(),
                      outputLanguage: null,
                      typeOfPromptId: null,
                    }),
                    {
                      loading: 'Saving your settings...',
                      success: 'Settings saved!',
                      error: 'Error saving your settings!',
                    },
                  )
                  .catch((error) => {
                    ErrorToast({ action: 'saving writing style', error })
                  })
              }}
            >
              <Input
                placeholder='Write like shakespeare'
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.currentTarget.value)
                }}
                required={true}
                name='custom-value'
              />

              <div className='flex items-center justify-between gap-2'>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-label='Load a preset...'
                      aria-expanded={open}
                      className='flex-1 justify-between'
                    >
                      Load a preset...
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full max-w-[350px] p-0'>
                    <Command>
                      <CommandInput placeholder='Search presets...' />
                      <CommandEmpty>No presets found.</CommandEmpty>
                      <CommandGroup heading='Examples'>
                        {presets.map((preset, id) => (
                          <CommandItem
                            key={id}
                            onSelect={() => {
                              setCustomValue(preset)
                              setOpen(false)
                            }}
                          >
                            {preset}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Button type='submit'>Save</Button>
              </div>
            </form>
          )}
          <RadioGroup
            defaultValue={value}
            onValueChange={(value) => {
              setValue(value)
              setCustomValue('')

              if (value !== 'custom') {
                toast
                  .promise(
                    updateContentSettings({
                      token,
                      writingStyle: value,
                      outputLanguage: null,
                      typeOfPromptId: null,
                    }),
                    {
                      loading: 'Saving your settings...',
                      success: 'Settings saved!',
                      error: 'Error saving your settings!',
                    },
                  )
                  .catch((error) => {
                    ErrorToast({ action: 'saving writing style', error })
                  })
              }
            }}
            className={cn(value === 'custom' ? 'flex items-center gap-2' : 'grid gap-2')}
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='Default' id='r1' />
              <Label htmlFor='r1'>Default</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='ASK' id='r3' />
              <Label htmlFor='r3'>Ask me everytime</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='custom' id='r2' />
              <Label htmlFor='r2'>Custom</Label>
            </div>
          </RadioGroup>
        </section>
      </section>

      <Alert>
        <Megaphone className='h-4 w-4' />
        <AlertTitle className={cn('text-orange-400 font-bold')}>Caution!</AlertTitle>
        <AlertDescription>Writing style is not 100% effective if the output language is not English.</AlertDescription>
      </Alert>
    </section>
  )
}
