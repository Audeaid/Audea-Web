import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface ILoginWithPassword {
  __typename: 'AuthPayLoad';
  token: string;
}

export const loginWithPassword = ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ILoginWithPassword> => {
  const query = gql`
    query LoginWithPassword($email: String!, $password: String!) {
      loginWithPassword(email: $email, password: $password) {
        token
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { loginWithPassword },
        } = await client.query({
          query,
          variables: {
            email,
            password,
          },
        });

        resolve(loginWithPassword);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
