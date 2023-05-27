'use client';

import { useState } from 'react';
import FirstSequence from './FirstSequence';
import SecondSequence from './SecondSequence';
import ThirdSequence from './ThirdSequence';
import FourthSequence from './FourthSequence';
import FifthSequence from './FifthSequence';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

const Sequence = ({ router }: { router: AppRouterInstance }) => {
  const [progress, setProgress] = useState(1);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [jwtToken, setJwtToken] = useState('');

  switch (progress) {
    case 1:
      return <FirstSequence setEmail={setEmail} setProgress={setProgress} />;

    case 2:
      return (
        <SecondSequence
          email={email}
          setJwtToken={setJwtToken}
          setProgress={setProgress}
        />
      );

    case 3:
      return (
        <ThirdSequence
          setPasswordForm={setPassword}
          setProgress={setProgress}
        />
      );

    case 4:
      return <FourthSequence setNameForm={setName} setProgress={setProgress} />;

    case 5:
      return (
        <FifthSequence
          email={email}
          password={password}
          name={name}
          jwtToken={jwtToken}
          router={router}
        />
      );

    default:
      return <></>;
  }
};

export default Sequence;
