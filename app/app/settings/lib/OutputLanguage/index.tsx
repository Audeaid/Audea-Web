'use client';

import { Dispatch, SetStateAction } from 'react';
import { IGetContentSettings } from '../../graphql';
import Tooltip from '@/components/Tooltip';
import { outputLanguageListWithAsk } from '@/app/utils/outputLanguage';

const OutputLanguage = ({
  userOutputLanguage,
  edit,
  setOutputLanguage,
}: {
  userOutputLanguage: IGetContentSettings['outputLanguage'];
  edit: boolean;
  setOutputLanguage: Dispatch<
    SetStateAction<IGetContentSettings['outputLanguage']>
  >;
}) => {
  return (
    <section className="flex sm:flex-row sm:items-center sm:justify-between flex-col gap-4 flex-wrap">
      <section className="flex flex-col gap-2">
        <h3 className="text-2xl text-primaryDark font-medium">
          Output Language
        </h3>
        <p className="md:max-w-full max-w-[365px]">
          Change the written content language based on your preferences.{' '}
          <Tooltip text='If you set "Same as trascript" but in your transcript you mixed English with other languages, the AI has a tendency to produce content in English.' />
        </p>
      </section>

      {edit ? (
        <select
          id="dropdown"
          name="output-language"
          value={userOutputLanguage}
          onChange={(e) => {
            const val = e.target.value as
              | 'TRANSCRIPT'
              | 'ENGLISH'
              | 'BAHASAINDONESIA'
              | 'CHINESE'
              | 'HINDI'
              | 'JAPANESE'
              | 'SPANISH'
              | 'FRENCH'
              | 'RUSSIAN'
              | 'URDU'
              | 'ARABIC'
              | 'ASK';
            setOutputLanguage(val);
          }}
          className="py-2 px-1 border-2 border-primary rounded-md text-onPrimaryContainer"
        >
          {outputLanguageListWithAsk.map((value, index) => {
            return (
              <option key={index} value={value.db}>
                {value.displayName}
              </option>
            );
          })}
        </select>
      ) : (
        <p className="py-2 px-1 border-2 border-gray-700 bg-gray-600 rounded-md text-white w-fit cursor-not-allowed">
          {
            outputLanguageListWithAsk.find(
              (val) => val.db === userOutputLanguage
            )?.displayName
          }
        </p>
      )}
    </section>
  );
};

export default OutputLanguage;
