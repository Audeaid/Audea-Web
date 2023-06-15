'use client';

import { motion } from 'framer-motion';
import type { ISocialMediaLogin } from './index.d';
import Google from './logo/google.svg';
import Microsoft from './logo/microsoft.svg';
import Apple from './logo/apple.svg';
import Image from 'next/image';
import { useSignIn } from '@clerk/nextjs';
import { OAuthStrategy } from '@clerk/nextjs/dist/types/server';

const SocialMediaLogin: React.FC<ISocialMediaLogin> = ({
  disabled,
  children,
  type,
  referralId,
  ...props
}) => {
  const { signIn } = useSignIn();

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn?.authenticateWithRedirect({
      strategy,
      redirectUrl: referralId
        ? `/login/sso-callback?referralId=${referralId}`
        : '/login/sso-callback',
      redirectUrlComplete: '/',
    });
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      animate={{
        opacity: disabled ? 0.5 : 1,
      }}
      whileHover={{ scale: disabled ? [null, 1, 1] : [null, 1.1, 1.05] }}
      transition={{ duration: 0.5 }}
      className={`text-sm select-none border-2 rounded shadow-sm border-border flex items-center justify-center w-full h-fit gap-4 bg-background text-foreground py-1.5 ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={() => {
        signInWith(renderOauthStrategy(type));
      }}
      {...props}
    >
      <RenderSocialImage type={type} />
      {children}
    </motion.button>
  );
};

export default SocialMediaLogin;

const RenderSocialImage = ({ type }: { type: ISocialMediaLogin['type'] }) => {
  const src = () => {
    switch (type) {
      case 'google':
        return Google;

      case 'apple':
        return Apple;

      case 'microsoft':
        return Microsoft;

      default:
        return Google;
    }
  };
  return <Image src={src()} alt={`${type} logo`} height={20} />;
};

const renderOauthStrategy = (
  type: ISocialMediaLogin['type']
): OAuthStrategy => {
  switch (type) {
    case 'google':
      return 'oauth_google';

    case 'apple':
      return 'oauth_apple';

    case 'microsoft':
      return 'oauth_microsoft';

    default:
      return 'oauth_google';
  }
};
