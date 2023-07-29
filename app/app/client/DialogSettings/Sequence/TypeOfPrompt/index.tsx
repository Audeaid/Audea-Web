'use client'

import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { Prompt, prompt } from '@/app/data/typeOfPrompt'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PromptItem } from '@/app/app/settings/client/SelectPrompt/component/PromptItem'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ViewportContext } from '@/context/Viewport'
import cn from '@/utils/cn'
import { NOTE_EXAMPLE_URL } from '@/utils/constant'

interface Props {
  value: string
  setValue: Dispatch<SetStateAction<string>>
  saved: boolean
  setSaved: Dispatch<SetStateAction<boolean>>
}

export function TypeOfPrompt({ value, setValue, saved, setSaved }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt>(
    prompt.find((prompt) => prompt.id === value) ?? prompt[0],
  )
  const [peekedPrompt, setPeekedPrompt] = useState<Prompt>(prompt.find((prompt) => prompt.id === value) ?? prompt[0])

  const [checked, setChecked] = useState(saved ?? false)

  const { isMobile } = useContext(ViewportContext)

  return (
    <section className='flex flex-col gap-8'>
      <p>
        Choose on what type of content do you want. See all examples{' '}
        <a href={NOTE_EXAMPLE_URL} target='_blank' className='underline' rel='noreferrer'>
          here
        </a>
        .
      </p>

      <div className='grid gap-2'>
        {isMobile ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
                {selectedPrompt
                  ? prompt.find((prompt) => prompt.id === selectedPrompt.id)?.name
                  : 'Select type of content...'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[250px] p-0'>
              <Command>
                <CommandInput placeholder='Search type of content...' />
                <CommandEmpty>No type of content exist.</CommandEmpty>
                <CommandGroup>
                  {prompt
                    .filter((v) => v.id !== '647391c118e8a4e1170d3ec9')
                    .map((oneprompt) => (
                      <CommandItem
                        key={oneprompt.id}
                        onSelect={(currentValue) => {
                          const selectPrompt = prompt.find((v) => v.name.toLowerCase() === currentValue)

                          if (!selectPrompt) return

                          setSelectedPrompt(selectPrompt)
                          setValue(selectPrompt.id)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedPrompt.id === oneprompt.id ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {oneprompt.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={open}
                aria-label='Select a prompt'
                className='w-full justify-between'
              >
                {selectedPrompt ? selectedPrompt.name : 'Select a prompt...'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-[250px] p-0'>
              <HoverCard>
                <HoverCardContent side='left' align='start' forceMount className='min-h-[280px]'>
                  <div className='grid gap-2'>
                    <h4 className='font-medium leading-none'>{peekedPrompt.name}</h4>
                    <div className='text-sm text-muted-foreground'>{peekedPrompt.description}</div>
                    {peekedPrompt.strengths ? (
                      <div className='mt-4 grid gap-2'>
                        <h5 className='text-sm font-medium leading-none'>Strengths</h5>
                        <ul className='text-sm text-muted-foreground'>{peekedPrompt.strengths}</ul>
                      </div>
                    ) : null}
                  </div>
                </HoverCardContent>
                <Command loop>
                  <CommandList className='h-[var(--cmdk-list-height)] max-h-[400px]'>
                    <CommandInput placeholder='Search prompt...' />
                    <CommandEmpty>No prompt found.</CommandEmpty>
                    <HoverCardTrigger />

                    <CommandGroup>
                      {prompt.map((prompt) => {
                        if (prompt.id !== '647391c118e8a4e1170d3ec9') {
                          return (
                            <PromptItem
                              key={prompt.id}
                              prompt={prompt}
                              isSelected={selectedPrompt?.id === prompt.id}
                              onPeek={(prompt) => setPeekedPrompt(prompt)}
                              onSelect={() => {
                                setSelectedPrompt(prompt)
                                setOpen(false)
                                setValue(prompt.id)
                              }}
                            />
                          )
                        }
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </HoverCard>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className='flex items-center space-x-2'>
        <Checkbox
          id='save'
          onCheckedChange={(v) => {
            if (v) {
              setChecked(true)
              setSaved(true)
            } else {
              setChecked(false)
              setSaved(false)
            }
          }}
          checked={checked}
        />
        <Label
          htmlFor='save'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          Don&apos;t ask me next time
        </Label>
      </div>
    </section>
  )
}
