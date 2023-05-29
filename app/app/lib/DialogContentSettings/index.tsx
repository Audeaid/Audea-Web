import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { IGetContentSettings } from '../../graphql';
import Sequence from './Sequence';

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
                  className="text-lg font-bold leading-6 w-full h-fit bg-primary text-onPrimary px-6 py-4 shadow-inner"
                >
                  Content Settings
                </Dialog.Title>

                <div className="text-onPrimaryContainer px-6 pb-4 pt-8">
                  <Sequence
                    contentSettings={contentSettings}
                    token={token}
                    setIsOpen={setIsOpen}
                    onFinish={onFinish}
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
