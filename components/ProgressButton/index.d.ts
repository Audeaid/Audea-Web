export interface IProgressButton
  extends React.ComponentPropsWithoutRef<'button'> {
  disabled: boolean;
  from: IPercentage;
  to: IPercentage;
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
