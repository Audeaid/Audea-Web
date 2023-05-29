import { HTMLMotionProps } from 'framer-motion';

export interface IProgressButton extends HTMLMotionProps<'button'> {
  disabled: boolean;
  from: IPercentage;
  to: IPercentage;
  children?: React.ReactNode;
}

export type IPercentage =
  | '0%'
  | '10%'
  | '20%'
  | '30%'
  | '40%'
  | '50%'
  | '60%'
  | '70%'
  | '80%'
  | '90%'
  | '100%';
