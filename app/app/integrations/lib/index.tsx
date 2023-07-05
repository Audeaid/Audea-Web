'use client';

import Notion from './Notion';
import QuestionMark from './QuestionMark';
import Zapier from './Notyet/Zapier';
import Todoist from './Notyet/Todoist';
import { motion } from 'framer-motion';
import DreamWorkflowForm from './DreamWorkflowForm';
import Whatsapp from './Whatsapp';
import Sunsama from './Notyet/Sunsama';
import Obsidian from './Notyet/Obsidian';
import Monday from './Notyet/Monday';
import Gmail from './Gmail';
import Github from './Notyet/Github';
import Evernote from './Notyet/Evernote';
import Craft from './Notyet/Craft';
import Clickup from './Notyet/Clickup';
import { IGetNotionAccount } from '../graphql';

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
}: {
  token: string;
  getNotionAccount: IGetNotionAccount | null;
  clickupInitialState: boolean;
  craftInitialState: boolean;
  evernoteInitialState: boolean;
  githubInitialState: boolean;
  gmailInitialState: boolean;
  mondayInitialState: boolean;
  obsidianInitialState: boolean;
  sunsamaInitialState: boolean;
  todoistInitialState: boolean;
  whatsappInitialState: boolean;
  zapierInitialState: boolean;
}) {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Integrations</h1>
        <p>Connect Audea with your existing tools</p>
      </header>

      <section className="my-10 space-y-2">
        <Notion token={token} getNotionAccount={getNotionAccount} />
      </section>

      <section className="my-10 space-y-2">
        <p className="dark:text-gray-700 text-gray-100 font-medium">
          Coming soon
        </p>
        <Whatsapp token={token} initialState={whatsappInitialState} />
        <Gmail token={token} initialState={gmailInitialState} />
      </section>

      <section className="space-y-8 mt-20 pb-20">
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <QuestionMark />
          <p className="font-bold text-xl">
            What integration should come next?
          </p>
        </div>

        <div className="flex flex-col gap-20">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <Zapier token={token} initialState={zapierInitialState} />
            <Todoist token={token} initialState={todoistInitialState} />
            <Sunsama token={token} initialState={sunsamaInitialState} />
            <Obsidian token={token} initialState={obsidianInitialState} />
            <Monday token={token} initialState={mondayInitialState} />
            <Github token={token} initialState={githubInitialState} />
            <Evernote token={token} initialState={evernoteInitialState} />
            <Craft token={token} initialState={craftInitialState} />
            <Clickup token={token} initialState={clickupInitialState} />
          </div>

          <DreamWorkflowForm token={token} />
        </div>
      </section>
    </motion.section>
  );
}
