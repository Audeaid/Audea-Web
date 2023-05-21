import { ChangeEventHandler } from 'react';

export interface ITextInput extends React.ComponentPropsWithoutRef<'input'> {
  textLabel: string;
  handleChange?: ChangeEventHandler<HTMLInputElement>;
}
