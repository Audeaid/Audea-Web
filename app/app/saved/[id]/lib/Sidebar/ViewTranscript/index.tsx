'use client';

import LoadingContent from '@/components/LoadingContent';
import { faClose, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
// import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { Fragment, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getTypeOfPrompt, publicGetGptResponse, updateContent } from './script';

const ViewTranscript = ({
  token,
  transcript,
  contentId,
  //   router,
  outputLanguage,
  writingStyle,
  typeOfPromptId,
}: {
  token: string;
  transcript: string;
  contentId: string;
  //   router: AppRouterInstance;
  outputLanguage: string;
  writingStyle: string;
  typeOfPromptId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(transcript);
  const [regeneratingContent, setRegeneratingContent] = useState(false);
  const [condition, setCondition] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (edit && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [edit]);

  useEffect(() => {
    (async () => {
      if (regeneratingContent) {
        try {
          setCondition('Updating new transcript...');
          await updateContent({ token, contentId, transcript: value });

          setCondition('Getting your preferred settings...');
          const typeOfPrompt = await getTypeOfPrompt(token, typeOfPromptId);

          if (!typeOfPrompt) throw new Error('typeOfPrompt is null');

          setCondition('Regenerating new content...');
          const systemPrompt = typeOfPrompt.systemPrompt;
          const userPrompt = `Audio transcription:
                  ${value}
                  Output language: ${
                    outputLanguage === 'TRANSCRIPT'
                      ? 'Same as transcript'
                      : outputLanguage
                  }
                  Writing style: ${writingStyle}`;

          const response = await publicGetGptResponse(systemPrompt, userPrompt);

          setCondition('Parsing AI response...');
          const actualGptResponse = response.choices[0].message.content;
          const jsonGptResponse = JSON.parse(actualGptResponse);

          let title = '';
          for (const obj of jsonGptResponse) {
            if (obj.type === 'title') {
              title = obj.content;
              break;
            }
          }

          await updateContent({
            token,
            contentId,
            title,
            gptGenerated: actualGptResponse,
          });

          window.location.reload();
        } catch (error) {
          console.error(error);
          toast.error('Error regenerating content!');
          setValue(transcript);
          setEdit(false);
          setIsOpen(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regeneratingContent]);

  return (
    <>
      <button
        className="border-2 border-onPrimaryContainer rounded-md shadow-lg min-w-fit w-full h-fit py-2 sm:px-8 px-2 text-center flex items-center justify-center gap-2 text-onPrimaryContainer select-none sm:flex-row flex-col"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        View your transcript
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white pt-6 px-6 pb-10 text-center align-middle shadow-xl transition-all flex flex-col gap-8 relative">
                  {(() => {
                    if (regeneratingContent) {
                      return <LoadingContent condition={condition} />;
                    } else {
                      return (
                        <>
                          <Dialog.Title
                            as="div"
                            className={`text-xl font-bold leading-6 text-onPrimaryContainer text-left flex items-center justify-between flex-wrap gap-4 select-none ${
                              edit ? 'pt-2' : ''
                            }`}
                          >
                            {edit && (
                              <div className="w-full absolute h-fit inset-0">
                                <p className="w-fit h-fit mx-auto text-xs bg-gray-600 text-white rounded-b-lg px-1.5 py-0.5">
                                  EDITING ORIGINAL TRANSCRIPT
                                </p>
                              </div>
                            )}
                            <section className="flex items-center justify-center gap-2">
                              <button
                                className="w-fit h-fit"
                                onClick={() => {
                                  setValue(transcript);
                                  setEdit(false);
                                  setIsOpen(false);
                                }}
                                type="button"
                              >
                                <FontAwesomeIcon icon={faClose} />
                              </button>
                              <h3>Original Transcript</h3>
                            </section>
                            {edit ? (
                              <section className="flex items-center gap-4 flex-wrap select-none">
                                <button
                                  type="button"
                                  className="px-4 py-1 font-normal text-sm rounded-md border border-gray-500 text-gray-500"
                                  onClick={() => {
                                    setValue(transcript);
                                    setEdit(false);
                                  }}
                                >
                                  CANCEL
                                </button>

                                <button
                                  type="button"
                                  className="px-4 py-1 font-normal text-sm rounded-md shadow-md border border-primary bg-primary text-onPrimary"
                                  onClick={() => {
                                    setRegeneratingContent(true);
                                  }}
                                >
                                  SAVE & REGENERATE CONTENT
                                </button>
                              </section>
                            ) : (
                              <button
                                className="bg-primary text-onPrimary text-sm rounded-md shadow-md px-4 py-1 font-normal select-none"
                                type="button"
                                onClick={() => {
                                  setEdit(true);
                                }}
                              >
                                EDIT
                              </button>
                            )}
                          </Dialog.Title>

                          {edit ? (
                            <textarea
                              ref={textareaRef}
                              value={value}
                              onChange={(e) => {
                                setValue(e.target.value);
                              }}
                              className="rounded-md text-base font-normal text-onPrimaryContainer px-4 pt-2 pb-10 border border-primary w-full min-h-fit"
                              rows={10}
                            />
                          ) : (
                            <p className="text-base font-normal text-onPrimaryContainer text-justify max-h-[290px] overflow-auto overscroll-contain scroll-smooth rounded-md border border-primary shadow-2xl px-4 pt-2 pb-10">
                              {value}
                            </p>
                          )}
                        </>
                      );
                    }
                  })()}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ViewTranscript;
