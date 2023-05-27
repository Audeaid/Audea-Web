'use client';

import SocialMediaLogin from '@/components/SocialMediaLogin';

const socmedButton = [
  {
    type: 'google',
    onClick: () => {},
    disabled: true,
    text: 'Continue with Google',
  },
  {
    type: 'apple',
    onClick: () => {},
    disabled: true,
    text: 'Continue with Apple',
  },
  {
    type: 'microsoft',
    onClick: () => {},
    disabled: true,
    text: 'Continue with Microsoft',
  },
];

const SocialLogin = () => {
  return (
    <section className="flex flex-col gap-3">
      {socmedButton.map(({ disabled, onClick, type, text }, index) => {
        return (
          <SocialMediaLogin
            disabled={disabled}
            onClick={onClick}
            type={type as any}
            key={index}
          >
            {text}
          </SocialMediaLogin>
        );
      })}
    </section>
  );
};

export default SocialLogin;
