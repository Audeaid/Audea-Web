export interface ISocialMediaLogin {
  disabled: boolean;
  children: React.ReactNode;
  type: 'google' | 'apple' | 'microsoft' | 'notion';
  referralId?: string | null;
  signInOrSignUp: 'signIn' | 'signUp';
}
