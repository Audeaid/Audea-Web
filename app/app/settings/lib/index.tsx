'use client';

import { useLayoutEffect, useState } from 'react';
import { IGetContentSettings } from '../graphql';
import { motion } from 'framer-motion';
import OutputLanguage from './OutputLanguage';
import {
  IGetTypeOfPrompt,
  getTypeOfPrompt,
  updateContentSettings,
} from './script';
import TypeOfPrompt from './TypeOfPrompt';
import WritingStyle from './WritingStyle';
import toast from 'react-hot-toast';

export default function Client({
  contentSettings,
  token,
}: {
  contentSettings: IGetContentSettings;
  token: string;
}) {
  const [outputLanguage, setOutputLanguage] = useState(
    contentSettings.outputLanguage
  );
  const [writingStyle, setWritingStyle] = useState(
    contentSettings.writingStyle
  );
  const [typeOfPromptId, setTypeOfPromptId] = useState(
    contentSettings.typeOfPromptId
  );

  const [edit, setEdit] = useState(false);

  const [allTypeOfPrompt, setAllTypeOfPrompt] = useState<
    IGetTypeOfPrompt[] | null
  >(null);

  useLayoutEffect(() => {
    (async () => {
      try {
        const response = await getTypeOfPrompt(token);
        const reallyAllTypeOfPrompt: IGetTypeOfPrompt[] = [
          ...response,
          {
            __typename: 'TypeOfPrompt',
            id: '647391c118e8a4e1170d3ec9',
            displayName: 'Ask me everytime',
          },
        ];
        setAllTypeOfPrompt(reallyAllTypeOfPrompt);
      } catch (error) {
        console.error(error);
      }
    })();
  });

  return (
    <motion.section
      className={`flex flex-col gap-20 select-none`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className="w-full flex sm:flex-row flex-col sm:items-center h-fit sm:justify-between sm:gap-0 gap-4">
        <h1 className="text-4xl font-bold">Settings</h1>

        {edit ? (
          <section className="flex items-center gap-6">
            <button
              className="text-white px-5 py-1 text-xl rounded-lg shadow-xl font-bold w-fit h-fit border-2 border-gray-500"
              onClick={() => {
                setOutputLanguage(contentSettings.outputLanguage);
                setWritingStyle(contentSettings.writingStyle);
                setTypeOfPromptId(contentSettings.typeOfPromptId);
                setEdit(false);
              }}
            >
              CANCEL
            </button>
            <button
              className="bg-primaryDark text-onPrimaryDark px-5 py-1 text-xl rounded-lg shadow-xl font-bold w-fit h-fit border-2 border-primaryDark"
              onClick={() => {
                toast
                  .promise(
                    updateContentSettings({
                      token,
                      outputLanguage,
                      writingStyle:
                        writingStyle === 'Ask me everytime'
                          ? 'ASK'
                          : writingStyle,
                      typeOfPromptId,
                    }),
                    {
                      loading: 'Saving your settings...',
                      success: 'Success saving your settings!',
                      error: 'Error saving your settings!',
                    }
                  )
                  .then(
                    () => {
                      setEdit(false);
                    },
                    () => {
                      setOutputLanguage(contentSettings.outputLanguage);
                      setWritingStyle(contentSettings.writingStyle);
                      setTypeOfPromptId(contentSettings.typeOfPromptId);
                      setEdit(false);
                    }
                  );
              }}
            >
              SAVE
            </button>
          </section>
        ) : (
          <button
            className="bg-primaryDark text-onPrimaryDark px-5 py-1 text-xl rounded-lg shadow-xl font-bold w-fit h-fit border-2 border-primaryDark"
            onClick={() => {
              setEdit(true);
            }}
          >
            EDIT
          </button>
        )}
      </section>

      <section className="flex flex-col gap-16">
        <OutputLanguage
          userOutputLanguage={outputLanguage}
          edit={edit}
          setOutputLanguage={setOutputLanguage}
        />

        <WritingStyle
          userWritingStyle={writingStyle}
          edit={edit}
          setWritingStyle={setWritingStyle}
        />

        <TypeOfPrompt
          typeOfPromptId={typeOfPromptId}
          edit={edit}
          setTypeOfPromptId={setTypeOfPromptId}
          allTypeOfPrompt={allTypeOfPrompt ?? []}
        />
      </section>
    </motion.section>
  );
}
