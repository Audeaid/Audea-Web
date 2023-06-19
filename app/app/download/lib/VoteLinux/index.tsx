'use client';

import UpvoteButton from '../UpvoteButton';
import { gql, useSubscription } from '@apollo/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinux } from '@fortawesome/free-brands-svg-icons';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Circle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { votePlatform } from '../script';
import ErrorToast from '@/components/ErrorToast';

const VoteLinux = ({
  token,
  initialCount,
  isChecked,
}: {
  token: string;
  initialCount: number;
  isChecked: boolean;
}) => {
  const [count, setCount] = useState(initialCount);

  const [checked, setChecked] = useState(isChecked);
  const [animate, setAnimate] = useState(false);

  const subscriptionQuery = gql`
    subscription LinuxVoteSubscription {
      linuxVoteSubscription {
        platform
        vote
      }
    }
  `;

  const { data, error: subscriptionError } = useSubscription(subscriptionQuery);

  useEffect(() => {
    if (data) {
      const { vote } = data.linuxVoteSubscription;

      if (vote) {
        setCount(count + 1);
      } else {
        setCount(count - 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (subscriptionError) {
      ErrorToast('getting live upvote data', subscriptionError);
    }
  }, [subscriptionError]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full select-none max-w-[300px]"
    >
      <Card className="w-full h-full flex flex-col justify-between">
        <CardHeader className="flex items-start justify-between gap-4 space-y-0">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLinux} />
              <p>Linux</p>
            </CardTitle>
            <CardDescription>
              Linux is a free and open-source operating system kernel.
            </CardDescription>
          </div>
          <UpvoteButton
            handleChange={(e) => {
              if (e.target.checked) {
                setAnimate(true);

                toast
                  .promise(votePlatform(token, 'LINUX', true), {
                    loading: 'Saving your vote...',
                    success: 'Success saving your vote!',
                    error: 'Error saving your vote!',
                  })
                  .then(() => {
                    setChecked(true);
                  })
                  .catch((e) => {
                    ErrorToast('upvoting Linux platform', e);
                  });

                setTimeout(() => {
                  setAnimate(false);
                }, 700);
              } else {
                setAnimate(false);

                toast
                  .promise(votePlatform(token, 'LINUX', false), {
                    loading: 'Saving your vote...',
                    success: 'Success saving your vote!',
                    error: 'Error saving your vote!',
                  })
                  .then(() => {
                    setChecked(false);
                  })
                  .catch((e) => {
                    ErrorToast('upvoting Linux platform', e);
                  });
              }
            }}
            checked={checked}
            animate={animate}
          />
        </CardHeader>

        <CardContent>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Circle className="mr-1 h-3 w-3 fill-blue-400 text-blue-400" />
              Low priority
            </div>
            <div className="flex items-center">
              <Star className="mr-1 h-3 w-3" />
              {count}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VoteLinux;
