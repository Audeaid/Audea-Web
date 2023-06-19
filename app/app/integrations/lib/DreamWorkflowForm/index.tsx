'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import cn from '@/utils/cn';
import { MessagesSquare } from 'lucide-react';
import { postForm } from './script';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export default function DreamWorkflowForm({ token }: { token: string }) {
  const [value, setValue] = useState('');

  return (
    <form
      className="grid w-full gap-2"
      onSubmit={async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const longTextForm = formData.get('dream-workflow');

        if (!longTextForm) return;

        toast
          .promise(postForm(token, longTextForm.toString()), {
            loading: 'Sending your request...',
            success: 'Request sent!',
            error: 'Error sending request',
          })
          .then(() => {
            setValue('');
          });
      }}
    >
      <Label htmlFor="dream-workflow" className={cn('flex items-center gap-2')}>
        <MessagesSquare />
        Tell us your dream workflow
      </Label>
      <Textarea
        placeholder="Every time an audio is processed and the content is generated, I would like Audea to also post the markdown version to the third party app that I used frequently"
        id="dream-workflow"
        required={true}
        name="dream-workflow"
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
      <p className="text-sm text-muted-foreground">
        It will be helpful if you give us detailed example
      </p>
      <Button type="submit" size="sm">
        Submit
      </Button>
    </form>
  );
}
