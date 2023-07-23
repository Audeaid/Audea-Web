'use client'

import { useContext, useState } from 'react'
import { Prompt, prompt } from '@/app/data/typeOfPrompt'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PromptItem } from './component/PromptItem'
import cn from '@/utils/cn'
import toast from 'react-hot-toast'
import { updateContentSettings } from '../script'
import ErrorToast from '@/components/ErrorToast'
import { ViewportContext } from '@/context/Viewport'

interface Props {
  token: string
  initialValue: string
}

export default function SelectPrompt({ token, initialValue }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt>(
    prompt.find((prompt) => prompt.id === initialValue) ?? prompt[0],
  )
  const [peekedPrompt, setPeekedPrompt] = useState<Prompt>(
    prompt.find((prompt) => prompt.id === initialValue) ?? prompt[0],
  )

  const { isMobile } = useContext(ViewportContext)

  return (
    <section className='flex md:flex-row md:items-start md:justify-between flex-col gap-4 flex-wrap'>
      <section className='flex flex-col gap-2'>
        <h3 className='text-2xl font-medium'>Type of note</h3>
        <p className='md:max-w-full max-w-[365px]'>Change the type of note the AI will generate.</p>
        <p>
          See all the examples{' '}
          <a
            href='https://durrrian.notion.site/d9242908bb9f421b8d7fe86c0f5a424b?v=9df833bfa8da4d11b600295e741893fb&pvs=4'
            target='_blank'
            className='underline'
            rel='noreferrer'
          >
            here
          </a>
          .
        </p>
      </section>

      <div className='grid gap-2'>
        {isMobile ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant='outline' role='combobox' aria-expanded={open} className='w-[250px] justify-between'>
                {selectedPrompt
                  ? prompt.find((prompt) => prompt.id === selectedPrompt.id)?.name
                  : 'Select type of note...'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[250px] p-0'>
              <Command>
                <CommandInput placeholder='Search type of note...' />
                <CommandEmpty>No type of note exist.</CommandEmpty>
                <CommandGroup>
                  {prompt.map((oneprompt) => (
                    <CommandItem
                      key={oneprompt.id}
                      onSelect={(currentValue) => {
                        const selectPrompt = prompt.find((v) => v.name.toLowerCase() === currentValue)

                        if (!selectPrompt) return

                        setSelectedPrompt(selectPrompt)
                        setOpen(false)

                        toast
                          .promise(
                            updateContentSettings({
                              token,
                              writingStyle: null,
                              outputLanguage: null,
                              typeOfPromptId: selectPrompt.id,
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
                      <Check
                        className={cn('mr-2 h-4 w-4', selectedPrompt.id === oneprompt.id ? 'opacity-100' : 'opacity-0')}
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
                {selectedPrompt ? selectedPrompt.name : 'Select a type of note...'}
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
                    <CommandInput placeholder='Search type of note...' />
                    <CommandEmpty>No type of note found.</CommandEmpty>
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

                                toast
                                  .promise(
                                    updateContentSettings({
                                      token,
                                      writingStyle: null,
                                      outputLanguage: null,
                                      typeOfPromptId: prompt.id,
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
                            />
                          )
                        }
                      })}
                    </CommandGroup>

                    <CommandGroup heading='Or'>
                      <CommandItem
                        onSelect={() => {
                          setSelectedPrompt({
                            id: '647391c118e8a4e1170d3ec9',
                            name: 'Ask me everytime',
                            description: '',
                            strengths: '',
                          })
                          setOpen(false)

                          toast
                            .promise(
                              updateContentSettings({
                                token,
                                writingStyle: null,
                                outputLanguage: null,
                                typeOfPromptId: '647391c118e8a4e1170d3ec9',
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
                        className='aria-selected:bg-primary aria-selected:text-primary-foreground'
                      >
                        Ask me everytime
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedPrompt?.id === '647391c118e8a4e1170d3ec9' ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </HoverCard>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </section>
  )
}
