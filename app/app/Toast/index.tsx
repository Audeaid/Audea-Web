'use client';

import { ViewportContext } from '@/context/Viewport';
import cn from '@/utils/cn';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';

const Toast = () => {
  const { isMobile } = useContext(ViewportContext);

  return (
    <Toaster
      containerClassName="z-[99999999]"
      toastOptions={{
        className: cn(
          'rounded-md border bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-card text-foreground'
        ),
      }}
      position={isMobile ? 'bottom-left' : 'bottom-right'}
    />
  );
};

export default Toast;
