'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import Image, { ImageProps } from 'next/image'
import cn from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { ForwardRefExoticComponent, HTMLAttributes, RefAttributes, useState } from 'react'

import ErrorToast from '@/components/ErrorToast'
import { userRequestedIntegration } from '../../../graphql'

interface Props
  extends Omit<ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>>, '$$typeof'> {
  token: string
  initialState: boolean
  imageSrc: ImageProps['src']
  integrationName: string
}

export default function IntegrationCard({ token, initialState, imageSrc, integrationName }: Props) {
  const [click, setClick] = useState(initialState)

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn('flex items-center justify-between')}>
          <div className='flex items-center gap-4'>
            <Image
              src={imageSrc}
              quality={100}
              draggable={false}
              height={40}
              width={40}
              alt={`${integrationName} logo`}
            />
            {integrationName}
          </div>

          <Button
            variant={click ? 'destructive' : 'outline'}
            onClick={async () => {
              try {
                await userRequestedIntegration(token, `${integrationName.replaceAll(' ', '').toUpperCase()}`)
                setClick(true)
              } catch (error) {
                setClick(false)
                ErrorToast({ action: `request ${integrationName} integration`, error })
              }
            }}
            type='button'
            disabled={click}
            className={cn('disabled:opacity-100')}
          >
            {click ? 'Notified' : 'Notify'}
          </Button>
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
