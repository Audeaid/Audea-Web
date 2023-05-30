'use client';

import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { ITooltip } from './index.d';

const Tooltip: React.FC<ITooltip> = ({ text }) => {
  return (
    <Popover className="relative" as="span">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-full hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <FontAwesomeIcon icon={faCircleQuestion} />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className="fixed z-10 mt-3 -translate-x-1/2 transform p-2 bg-gray-600/50 rounded-lg shadow-lg ring-1 ring-white ring-opacity-5 w-fit max-w-md text-sm"
              as="span"
            >
              {text}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default Tooltip;
