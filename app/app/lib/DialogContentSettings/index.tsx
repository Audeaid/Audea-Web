import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { IGetContentSettings } from '../../graphql';
import Sequence from './Sequence';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const DialogContentSettings = ({
  isOpen,
  setIsOpen,
  contentSettings,
  token,
  onFinish,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  contentSettings: IGetContentSettings;
  token: string;
  onFinish: (
    _outputLanguage: string,
    _writingStyle: string,
    _typeOfPromptId: string
  ) => void;
}) => {
  const computeInitialProgress = () => {
    if (contentSettings.outputLanguage === 'ASK') {
      return 'output-language';
    } else if (contentSettings.writingStyle === 'ASK') {
      return 'writing-style';
    } else if (contentSettings.typeOfPromptId === '647391c118e8a4e1170d3ec9') {
      return 'type-of-prompt';
    } else {
      return 'output-language';
    }
  };

  const [progress, setProgress] = useState(computeInitialProgress());

  useEffect(() => {
    console.log(progress);
  }, [progress]);

  return (
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 w-full h-fit bg-primary text-onPrimary px-6 py-4 shadow-inner flex items-center gap-2"
                >
                  {progress === 'writing-style' &&
                    contentSettings.outputLanguage === 'ASK' && (
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        onClick={() => {
                          setProgress('output-language');
                        }}
                      />
                    )}
                  {progress === 'type-of-prompt' &&
                    (contentSettings.writingStyle === 'ASK' ||
                      contentSettings.outputLanguage === 'ASK') && (
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        onClick={() => {
                          if (contentSettings.writingStyle === 'ASK') {
                            setProgress('writing-style');
                          } else {
                            setProgress('output-language');
                          }
                        }}
                      />
                    )}
                  Content Settings
                </Dialog.Title>

                <div className="text-onPrimaryContainer px-6 pb-4 pt-8">
                  <Sequence
                    contentSettings={contentSettings}
                    token={token}
                    setIsOpen={setIsOpen}
                    onFinish={onFinish}
                    progress={progress}
                    setProgress={setProgress}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DialogContentSettings;
