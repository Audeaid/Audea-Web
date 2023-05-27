'use client';

import { useState } from 'react';
import FirstSequence from './FirstSequence';
import SecondSequence from './SecondSequence';
import ThirdSequence from './ThirdSequence';
import FourthSequence from './FourthSequence';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

const Sequence = ({
  token,
  router,
}: {
  token: string;
  router: AppRouterInstance;
}) => {
  const [progress, setProgress] = useState(1);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jwtToken, setJwtToken] = useState('');

  switch (progress) {
    case 1:
      return (
        <FirstSequence
          token={token}
          setEmail={setEmail}
          setProgress={setProgress}
        />
      );

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
        <ThirdSequence setProgress={setProgress} setPassword={setPassword} />
      );

    case 4:
      return (
        <FourthSequence
          email={email}
          password={password}
          jwtToken={jwtToken}
          router={router}
        />
      );

    default:
      return <></>;
  }
};

export default Sequence;
