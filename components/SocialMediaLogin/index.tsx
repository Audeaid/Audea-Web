'use client';

import { motion } from 'framer-motion';
import type { ISocialMediaLogin } from './index.d';
import styles from './index.module.css';
import Google from './logo/google.svg';
import Microsoft from './logo/microsoft.svg';
import Apple from './logo/apple.svg';
import Image from 'next/image';

const SocialMediaLogin: React.FC<ISocialMediaLogin> = ({
  disabled,
  onClick = () => {},
  children,
  type,
  ...props
}) => {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      animate={{
        opacity: disabled ? 0.5 : 1,
      }}
      whileHover={{ scale: disabled ? [null, 1, 1] : [null, 1.1, 1.05] }}
      transition={{ duration: 0.5 }}
      className={`${styles.button} ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={onClick}
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
