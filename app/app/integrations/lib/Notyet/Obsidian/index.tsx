'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import ObsidianImage from '../../images/Obsidian.png';
import cn from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { userRequestedIntegration } from '../../../graphql';
import ErrorToast from '@/components/ErrorToast';

export default function Obsidian({
  token,
  initialState,
}: {
  token: string;
  initialState: boolean;
}) {
  const [click, setClick] = useState(initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn('flex items-center justify-between')}>
          <div className="flex items-center gap-4">
            <Image
              src={ObsidianImage}
              quality={100}
              draggable={false}
              height={40}
              width={40}
              alt="Obsidian logo"
            />
            Obsidian
          </div>

          <Button
            variant={click ? 'destructive' : 'outline'}
            onClick={async () => {
              try {
                await userRequestedIntegration(token, 'OBSIDIAN');
                setClick(true);
              } catch (error) {
                setClick(false);
                ErrorToast('request clickup integration', error);
              }
            }}
            type="button"
            disabled={click}
            className={cn('disabled:opacity-100')}
          >
            {click ? 'Requested' : 'Request'}
          </Button>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
