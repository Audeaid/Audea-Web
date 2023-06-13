'use client';

import UpvoteButton from '../UpvoteButton';
import { gql, useSubscription } from '@apollo/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple } from '@fortawesome/free-brands-svg-icons';
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

const VoteIPadOS = ({
  token,
  initialCount,
  isChecked,
}: {
  token: string;
  initialCount: number;
  isChecked: boolean;
}) => {
  const [count, setCount] = useState(initialCount);

  const subscriptionQuery = gql`
    subscription IPadOSVoteSubscription {
      iPadOSVoteSubscription {
        platform
        vote
      }
    }
  `;

  const { data } = useSubscription(subscriptionQuery);

  useEffect(() => {
    if (data) {
      const { vote } = data.iPadOSVoteSubscription;

      if (vote) {
        setCount(count + 1);
      } else {
        setCount(count - 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
              <FontAwesomeIcon icon={faApple} />
              <p>iPadOS</p>
            </CardTitle>
            <CardDescription>
              iPadOS is a mobile operating system developed by Apple for their
              iPad.
            </CardDescription>
          </div>
          <UpvoteButton
            onChecked={() => {
              toast
                .promise(votePlatform(token, 'IPADOS', true), {
                  loading: 'Saving your vote...',
                  success: 'Success saving your vote!',
                  error: 'Error saving your vote!',
                })
                .catch((e) => {
                  console.log(JSON.parse(e));
                });
            }}
            onUnChecked={() => {
              toast
                .promise(votePlatform(token, 'IPADOS', false), {
                  loading: 'Saving your vote...',
                  success: 'Success saving your vote!',
                  error: 'Error saving your vote!',
                })
                .catch((e) => {
                  console.log(JSON.parse(e));
                });
            }}
            isChecked={isChecked}
          />
        </CardHeader>

        <CardContent>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Circle className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
              Medium priority
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

export default VoteIPadOS;
