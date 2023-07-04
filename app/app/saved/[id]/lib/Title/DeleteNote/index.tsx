'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import cn from '@/utils/cn';
import { useRouter } from 'next/navigation';
import { useState, Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import ErrorToast from '@/components/ErrorToast';
import { useUser } from '@clerk/nextjs';
import { deleteOneNote } from './script';

export default function DeleteNote({
  token,
  title,
  contentId,
  open,
  setOpen,
}: {
  token: string;
  title: string;
  contentId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [value, setValue] = useState('');
  const router = useRouter();

  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const valueToCheck = `Audea/${user.primaryEmailAddress?.emailAddress}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn('select-none')}>
        <DialogHeader>
          <DialogTitle>Delete {title}?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <p>
          This will also delete the associated Audio files with this content
          titled &quot;{title}&quot;!
        </p>

        <form
          className="flex flex-col gap-2 mt-10"
          onSubmit={(e) => {
            e.preventDefault();

            toast
              .promise(deleteOneNote({ token, contentId }), {
                loading: 'Deleting your note...',
                success: 'Note deleted!',
                error: 'Error deleting your note!',
              })
              .catch((e) => {
                ErrorToast('deleting your note', e);
              });

            router.push('/app/saved');
          }}
        >
          <p>
            Please type <strong>{valueToCheck}</strong> to confirm.
          </p>
          <Input
            required={true}
            value={value}
            onChange={(e) => {
              setValue(e.currentTarget.value);
            }}
          />
          <Button
            variant="destructive"
            className={cn('w-full text-sm')}
            type="submit"
            disabled={value !== valueToCheck}
          >
            Delete {title}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
