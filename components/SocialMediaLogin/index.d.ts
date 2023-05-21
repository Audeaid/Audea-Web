export interface ISocialMediaLogin {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
  type: 'google' | 'apple' | 'microsoft' | 'notion';
}
