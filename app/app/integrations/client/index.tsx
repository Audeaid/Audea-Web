'use client'

import Notion from './Notion'
import QuestionMark from './lib/QuestionMark'
import { motion } from 'framer-motion'
import DreamWorkflowForm from './DreamWorkflowForm'
import { IGetNotionAccount } from '../graphql'
import WhatsAppImage from './images/Whatsapp.png'
import GmailImage from './images/Gmail.jpeg'
import ClickupImage from './images/Clickup.png'
import CraftImage from './images/Craft.jpeg'
import EvernoteImage from './images/Evernote.png'
import MondayImage from './images/Monday.jpeg'
import ObsidianImage from './images/Obsidian.png'
import SunsamaImage from './images/Sunsama.jpg'
import TodoistImage from './images/Todoist.png'
import ZapierImage from './images/Zapier.png'
import GithubImage from './images/Github.png'
import IntegrationCard from './lib/IntegrationCard'

interface Props {
  token: string
  getNotionAccount: IGetNotionAccount | null
  clickupInitialState: boolean
  craftInitialState: boolean
  evernoteInitialState: boolean
  githubInitialState: boolean
  gmailInitialState: boolean
  mondayInitialState: boolean
  obsidianInitialState: boolean
  sunsamaInitialState: boolean
  todoistInitialState: boolean
  whatsappInitialState: boolean
  zapierInitialState: boolean
}

export default function Client({
  token,
  getNotionAccount,
  clickupInitialState,
  craftInitialState,
  evernoteInitialState,
  githubInitialState,
  gmailInitialState,
  mondayInitialState,
  obsidianInitialState,
  sunsamaInitialState,
  todoistInitialState,
  whatsappInitialState,
  zapierInitialState,
}: Props) {
  const comingSoon = [
    { integrationName: 'WhatsApp', initialState: whatsappInitialState, imageSrc: WhatsAppImage },
    { integrationName: 'Gmail', initialState: gmailInitialState, imageSrc: GmailImage },
  ]

  const notYet = [
    { integrationName: 'Zapier', initialState: zapierInitialState, imageSrc: ZapierImage },
    { integrationName: 'Todoist', initialState: todoistInitialState, imageSrc: TodoistImage },
    { integrationName: 'Sunsama', initialState: sunsamaInitialState, imageSrc: SunsamaImage },
    { integrationName: 'Obsidian', initialState: obsidianInitialState, imageSrc: ObsidianImage },
    { integrationName: 'Monday', initialState: mondayInitialState, imageSrc: MondayImage },
    { integrationName: 'Github', initialState: githubInitialState, imageSrc: GithubImage },
    { integrationName: 'Evernote', initialState: evernoteInitialState, imageSrc: EvernoteImage },
    { integrationName: 'Craft', initialState: craftInitialState, imageSrc: CraftImage },
    { integrationName: 'Clickup', initialState: clickupInitialState, imageSrc: ClickupImage },
  ]

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className='space-y-2'>
        <h1 className='text-4xl font-bold'>Integrations</h1>
        <p>Connect Audea with your existing tools</p>
      </header>

      <section className='my-10 space-y-2'>
        <Notion token={token} getNotionAccount={getNotionAccount} />
      </section>

      <section className='my-10 space-y-2'>
        <p className='dark:text-gray-700 text-gray-100 font-medium'>Coming soon</p>

        {comingSoon.map((v, i) => {
          return (
            <IntegrationCard
              key={i}
              token={token}
              initialState={v.initialState}
              imageSrc={v.imageSrc}
              integrationName={v.integrationName}
            />
          )
        })}
      </section>

      <section className='space-y-8 mt-20 pb-20'>
        <div className='w-full flex flex-col items-center justify-center gap-2'>
          <QuestionMark />
          <p className='font-bold text-xl'>What integration should come next?</p>
        </div>

        <div className='flex flex-col gap-20'>
          <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
            {notYet.map((v, i) => {
              return (
                <IntegrationCard
                  key={i}
                  token={token}
                  initialState={v.initialState}
                  imageSrc={v.imageSrc}
                  integrationName={v.integrationName}
                />
              )
            })}
          </div>

          <DreamWorkflowForm token={token} />
        </div>
      </section>
    </motion.section>
  )
}
