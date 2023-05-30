'use client';

import { Dispatch, SetStateAction } from 'react';
import { IGetTypeOfPrompt } from '../script';

const TypeOfPrompt = ({
  typeOfPromptId,
  edit,
  setTypeOfPromptId,
  allTypeOfPrompt,
}: {
  typeOfPromptId: string;
  edit: boolean;
  setTypeOfPromptId: Dispatch<SetStateAction<string>>;
  allTypeOfPrompt: IGetTypeOfPrompt[];
}) => {
  return (
    <section className="flex sm:flex-row sm:items-center sm:justify-between flex-col gap-4 flex-wrap">
      <section className="flex flex-col gap-2">
        <h3 className="text-2xl text-primaryDark font-medium">
          Type of content
        </h3>
        <section className="flex flex-col gap-1 max-w-[365px]">
          <p>Change the type of content the AI will generate.</p>
          <p>
            See all the examples{' '}
            <a
              href="https://audeaid.notion.site/d9242908bb9f421b8d7fe86c0f5a424b?v=9df833bfa8da4d11b600295e741893fb"
              target="_blank"
              className="text-primaryDark underline"
            >
              here
            </a>
            .
          </p>
        </section>
      </section>

      {edit ? (
        <select
          id="dropdown"
          name="output-language"
          value={typeOfPromptId}
          onChange={(e) => {
            setTypeOfPromptId(e.target.value);
          }}
          className="py-2 px-1 border-2 border-primary rounded-md text-onPrimaryContainer"
        >
          {allTypeOfPrompt.map((value, index) => {
            return (
              <option key={index} value={value.id}>
                {value.displayName}
              </option>
            );
          })}
        </select>
      ) : (
        <p className="py-2 px-1 border-2 border-gray-700 bg-gray-600 rounded-md text-white w-fit cursor-not-allowed">
          {
            allTypeOfPrompt.find((val) => val.id === typeOfPromptId)
              ?.displayName
          }
        </p>
      )}
    </section>
  );
};

export default TypeOfPrompt;
