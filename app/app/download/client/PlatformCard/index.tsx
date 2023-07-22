'use client'

import UpvoteButton from '../../lib/UpvoteButton'
import { DocumentNode, useSubscription } from '@apollo/client'
import toast from 'react-hot-toast'
import { ForwardRefComponent, HTMLMotionProps, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Circle, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { votePlatform } from './script'
import ErrorToast from '@/components/ErrorToast'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface Props extends Omit<ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>, '$$typeof'> {
  token: string
  initialCount: number
  isChecked: boolean
  subscriptionQuery: DocumentNode
  /**
   * This should be the subscription name
   * Example:
   *    subscription AndroidTabletVoteSubscription {
   *        androidTabletVoteSubscription {
   *            platform
   *            vote
   *        }
   *    }
   * should be: androidTabletVoteSubscription
   */
  subscriptionName: string
  icon: IconProp
  title: string
  description: string
  priority: string
  platform: string
}

const PlatformCard = ({
  token,
  initialCount,
  isChecked,
  subscriptionQuery,
  subscriptionName,
  icon,
  title,
  description,
  priority,
  platform,
  ...props
}: Props) => {
  const [count, setCount] = useState(initialCount)

  const [checked, setChecked] = useState(isChecked)
  const [animate, setAnimate] = useState(false)

  const { data, error: subscriptionError } = useSubscription(subscriptionQuery)

  useEffect(() => {
    if (data) {
      const { vote } = data[`${subscriptionName}`]

      if (vote) {
        setCount(count + 1)
      } else {
        setCount(count - 1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (subscriptionError) {
      ErrorToast({ action: 'getting live upvote data', error: subscriptionError })
    }
  }, [subscriptionError])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='w-full h-full select-none max-w-[300px] max-h-[250px]'
      {...props}
    >
      <Card className='w-full h-full flex flex-col justify-between'>
        <CardHeader className='flex items-start justify-between gap-4 space-y-0'>
          <div className='space-y-1'>
            <CardTitle className='flex items-center gap-2'>
              <FontAwesomeIcon icon={icon} />
              <p>{title}</p>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <UpvoteButton
            handleChange={(e) => {
              if (e.target.checked) {
                setAnimate(true)

                toast
                  .promise(votePlatform(token, platform, true), {
                    loading: 'Saving your vote...',
                    success: 'Success saving your vote!',
                    error: 'Error saving your vote!',
                  })
                  .then(() => {
                    setChecked(true)
                  })
                  .catch((error) => {
                    ErrorToast({ action: `upvoting ${title} platform`, error })
                  })

                setTimeout(() => {
                  setAnimate(false)
                }, 700)
              } else {
                setAnimate(false)

                toast
                  .promise(votePlatform(token, platform, false), {
                    loading: 'Saving your vote...',
                    success: 'Success saving your vote!',
                    error: 'Error saving your vote!',
                  })
                  .then(() => {
                    setChecked(false)
                  })
                  .catch((e) => {
                    ErrorToast({ action: `upvoting ${title} platform`, error: e })
                  })
              }
            }}
            checked={checked}
            animate={animate}
          />
        </CardHeader>

        <CardContent>
          <div className='flex space-x-4 text-sm text-muted-foreground'>
            <div className='flex items-center'>
              <Circle className='mr-1 h-3 w-3 fill-red-400 text-red-400' />
              {priority}
            </div>
            <div className='flex items-center'>
              <Star className='mr-1 h-3 w-3' />
              {count}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default PlatformCard
