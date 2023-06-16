'use client';

import cn from '@/utils/cn';
import { CardContent } from '@/components/ui/card';
import { FormEventHandler, MouseEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import OtpInput from 'react-otp-input';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';

export default function EmailCode({
  email,
  handleSubmit,
  loading,
  errorMsg,
  handleEditEmail,
}: {
  email: string;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  loading: boolean;
  errorMsg: string | null;
  handleEditEmail: MouseEventHandler<HTMLButtonElement>;
}) {
  const [otp, setOtp] = useState('');

  return (
    <CardContent className={cn('flex flex-col gap-8 mt-4')}>
      <Badge
        variant="outline"
        className={cn('text-sm px-4 py-1.5 w-fit h-fit')}
      >
        {email}
        <button onClick={handleEditEmail} type="button">
          <Edit className="ml-4 w-4 h-4" />
        </button>
      </Badge>

      <p>
        We&apos;ve sent you a one-time code to <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <OtpInput
          placeholder="696969"
          value={otp}
          onChange={setOtp}
          numInputs={6}
          containerStyle={
            'w-full flex flex-row justify-between gap-1 mt-2 font-medium text-xl'
          }
          inputStyle={{
            width: '100%',
            maxWidth: '60px',
          }}
          renderInput={(props, index) => (
            <Input
              {...props}
              className="text-xl"
              name={`otp-${index}`}
              required={true}
            />
          )}
        />
        <Button disabled={loading} type="submit">
          {loading && <LoadingSpinner size={4} />}
          Verify code
        </Button>

        {errorMsg && (
          <p className="text-xs text-justify text-destructive">{errorMsg}</p>
        )}
      </form>

      <p className="select-none text-background" aria-hidden={true}>
        By clicking &quot;Continue with Google / Email&quot; above, you
      </p>
    </CardContent>
  );
}
