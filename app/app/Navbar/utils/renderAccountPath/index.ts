export const renderAccountPath = (pathname: string) => {
  switch (pathname) {
    case 'profile':
      return 'Update profile';

    case 'email-address':
      return 'Add email address';

    case 'connected-account':
      return 'Add connected account';

    case 'password':
      return 'Set password';

    default:
      return 'Update profile';
  }
};
