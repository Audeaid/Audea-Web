'use client';

import { Dispatch, useState, SetStateAction } from 'react';
import FirstSequence from './FirstSequence';
import { IGetContentSettings } from '@/app/app/graphql';
import SecondSequence from './SecondSequence';
import ThirdSequence from './ThirdSequence';

const Sequence = ({
  contentSettings,
  token,
  onFinish,
  setIsOpen,
  progress,
  setProgress,
}: {
  contentSettings: IGetContentSettings;
  token: string;
  onFinish: (
    _outputLanguage: string,
    _writingStyle: string,
    _typeOfPromptId: string
  ) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  progress: string;
  setProgress: Dispatch<SetStateAction<string>>;
}) => {
  const [outputLanguage, setOutputLanguage] = useState<string>(
    contentSettings.outputLanguage
  );
  const [writingStyle, setWritingStyle] = useState(
    contentSettings.writingStyle
  );
  const [typeOfPromptId, setTypeOfPromptId] = useState(
    contentSettings.typeOfPromptId
  );

  switch (progress) {
    case 'output-language':
      return (
        <FirstSequence
          setOutputLanguage={setOutputLanguage}
          handleClick={() => {
            if (contentSettings.writingStyle === 'ASK') {
              setProgress('writing-style');
            } else if (
              contentSettings.typeOfPromptId === '647391c118e8a4e1170d3ec9'
            ) {
              setProgress('type-of-prompt');
            } else {
              //do the file upload
              setIsOpen(false);
              onFinish(outputLanguage, writingStyle, typeOfPromptId);
            }
          }}
          token={token}
        />
      );

    case 'writing-style':
      return (
        <SecondSequence
          setWritingStyle={setWritingStyle}
          handleClick={() => {
            if (contentSettings.typeOfPromptId === '647391c118e8a4e1170d3ec9') {
              setProgress('type-of-prompt');
            } else {
              // do the file upload
              setIsOpen(false);
              onFinish(outputLanguage, writingStyle, typeOfPromptId);
            }
          }}
          token={token}
        />
      );

    case 'type-of-prompt':
      return (
        <ThirdSequence
          setTypeOfPromptId={setTypeOfPromptId}
          handleClick={() => {
            // do the file upload
            setIsOpen(false);
            onFinish(outputLanguage, writingStyle, typeOfPromptId);
          }}
          token={token}
        />
      );

    default:
      return <></>;
  }
};

export default Sequence;
