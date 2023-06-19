'use client';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Clipboard } from 'lucide-react';

export default function CopyButton({ text }: { text: string }) {
  return (
    <div className="w-full h-fit max-w-[1000px] flex items-center justify-end select-none">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          toast.promise(navigator.clipboard.writeText(text), {
            loading: 'Copying text...',
            success: 'Text copied!',
            error: 'Error copying text!',
          });
        }}
      >
        <Clipboard className="mr-2 h-4 w-4" /> Copy error message
      </Button>
    </div>
  );
}
