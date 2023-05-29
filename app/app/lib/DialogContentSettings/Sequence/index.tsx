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
}: {
  contentSettings: IGetContentSettings;
  token: string;
  onFinish: (
    _outputLanguage: string,
    _writingStyle: string,
    _typeOfPromptId: string
  ) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
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

  const [outputLanguage, setOutputLanguage] = useState('');
  const [writingStyle, setWritingStyle] = useState('');
  const [typeOfPromptId, setTypeOfPromptId] = useState('');

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
