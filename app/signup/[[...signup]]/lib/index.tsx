'use client';

import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import cn from '@/utils/cn';
import Sequence from './Sequence';
import ImageSrc from '@/public/logo/secondary.svg';
import Toast from '@/app/app/Toast';

export default function Client({
  initialEmail,
  initialFirstName,
  initialLastName,
  referralJwt,
}: {
  initialEmail: string | null;
  initialFirstName: string | null;
  initialLastName: string | null;
  referralJwt: string | null;
}) {
  const router = useRouter();

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 px-0 select-none">
      <Image
        src={ImageSrc}
        quality={100}
        draggable={false}
        alt="Audea Logo"
        height={25}
        className="lg:hidden block absolute left-4 top-5 md:left-8 md:top-9"
      />
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)',
          }}
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src={ImageSrc}
            quality={100}
            draggable={false}
            alt="Audea Logo"
            height={30}
          />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Audea has helped me countless of hours and helped me
              deliver idea faster so that I can bring my projects into fruition!
              Highly recommended!&rdquo;
            </p>
            <footer className="text-sm">Annissaa Maharani</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 block">
        <Sequence
          router={router}
          initialEmail={initialEmail}
          initialFirstName={initialFirstName}
          initialLastName={initialLastName}
          referralJwt={referralJwt}
        />
      </div>

      <Toast />
    </div>
  );
}
