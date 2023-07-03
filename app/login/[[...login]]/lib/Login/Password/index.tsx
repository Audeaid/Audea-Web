'use client';

import cn from '@/utils/cn';
import { CardContent } from '@/components/ui/card';
import { FormEventHandler, MouseEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function Password({
  email,
  handleSubmit,
  loading,
  errorMsg,
  handleEditEmail,
  onForgotPassword,
}: {
  email: string;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  loading: boolean;
  errorMsg: string | null;
  handleEditEmail: MouseEventHandler<HTMLButtonElement>;
  onForgotPassword: MouseEventHandler<HTMLButtonElement>;
}) {
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

      <div className="flex flex-col gap-1">
        <p>Enter your password</p>
        <button
          className="text-blue-500 w-fit h-fit text-xs"
          type="button"
          onClick={onForgotPassword}
        >
          Forgot password?
        </button>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            placeholder="Enter your password..."
            type="password"
            name="password"
            required={true}
            id="password"
          />
        </div>

        <Button disabled={loading} type="submit">
          {loading && <LoadingSpinner size={4} />}
          Sign in
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
