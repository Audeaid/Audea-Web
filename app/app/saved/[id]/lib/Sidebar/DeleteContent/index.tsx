'use client';

import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { Fragment, useState } from 'react';
import { toast } from 'react-hot-toast';
import { deleteOneContent } from './script';

const DeleteContent = ({
  token,
  title,
  contentId,
  router,
}: {
  token: string;
  title: string;
  contentId: string;
  router: AppRouterInstance;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="border-2 border-error rounded-md shadow-lg min-w-fit w-full h-fit py-2 sm:px-8 px-2 text-center flex items-center justify-center gap-2 text-error select-none sm:flex-row flex-col"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
        Delete content
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 select-none"
          onClose={() => {
            setIsOpen(false);
          }}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all flex flex-col gap-8">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-6 text-onPrimaryContainer text-left"
                  >
                    Are you sure you want to delete this content?
                  </Dialog.Title>
                  <p className="text-lg text-onPrimaryContainer">
                    &quot;{title}&quot;
                  </p>

                  <section className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-md border-2 border-gray-500 text-gray-500"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-md border-2 border-error text-onError bg-error"
                      onClick={() => {
                        toast
                          .promise(deleteOneContent(token, contentId), {
                            loading: 'Deleting your content...',
                            success: 'Success deleting your content!',
                            error: 'Error deleting your content!',
                          })
                          .then(
                            () => {
                              router.push('/app/saved');
                            },
                            () => {
                              setIsOpen(false);
                            }
                          );
                      }}
                    >
                      Delete
                    </button>
                  </section>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DeleteContent;
