'use client';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuDialogItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Mail } from 'lucide-react';
import cn from '@/utils/cn';
import { capitalizeEveryWord } from '@/helper';
import toast from 'react-hot-toast';
import { sendUserEmail } from './script';
import { User } from '@clerk/nextjs/dist/types/server';
import axios from 'axios';
import { useState } from 'react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import LoadingSpinner from '@/components/LoadingSpinner';

const EmailDialog = ({ token }: { token: string }) => {
  const [emailExist, setEmailExist] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <DropdownMenuDialogItem
      trigger={
        <>
          <Mail className="mr-2 h-4 w-4" />
          <span>Email</span>
        </>
      }
    >
      <DialogContent className="sm:max-w-[425px] select-none">
        <DialogHeader>
          <DialogTitle>Invite your friends</DialogTitle>
          <DialogDescription>
            Send an invitation email to use Audea to your friends or colleagues.
          </DialogDescription>
        </DialogHeader>
        <form
          className={cn('flex flex-col gap-4')}
          onSubmit={async (e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);

            const emailForm = formData.get('email');
            const firstNameForm = formData.get('first-name');
            const lastNameForm = formData.get('last-name');

            if (
              firstNameForm !== null &&
              lastNameForm !== null &&
              emailForm !== null
            ) {
              const email = emailForm.toString();
              const firstName = capitalizeEveryWord(firstNameForm.toString());
              const lastName = capitalizeEveryWord(lastNameForm.toString());

              try {
                setLoading(true);
                const { data: isEmailExistResponse }: { data: User[] } =
                  await axios.post('/api/clerkUser', formData);

                const isEmailExist = isEmailExistResponse.length !== 0;
                setLoading(false);

                if (isEmailExist) {
                  setEmailExist(true);
                } else {
                  toast
                    .promise(
                      sendUserEmail({ token, email, firstName, lastName }),
                      {
                        loading: 'Sending email...',
                        success: 'Email successfully sent!',
                        error: 'Error sending the email!',
                      }
                    )
                    .catch((e) => {
                      console.log(JSON.parse(e));
                    });
                }
              } catch (e) {
                setLoading(false);
                const error = JSON.stringify(e);
                console.log(JSON.parse(error));
              }
            }
          }}
        >
          <div className="py-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="vindiesel@gmail.com"
                required={true}
                type="email"
                name="email"
              />
            </div>

            <div className="flex gap-2 items-center w-full">
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  placeholder="Vin"
                  required={true}
                  type="text"
                  name="first-name"
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Diesel"
                  required={true}
                  type="text"
                  name="last-name"
                />
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-end">
            <Button type="submit">
              {loading && <LoadingSpinner size={4} />}
              Send email
            </Button>
          </div>
        </form>

        {emailExist && (
          <Alert className={cn('my-4')}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertTitle>Email is a registered Audea user!</AlertTitle>
          </Alert>
        )}
      </DialogContent>
    </DropdownMenuDialogItem>
  );
};

export default EmailDialog;
