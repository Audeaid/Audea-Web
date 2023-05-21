import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface ISignUpWithPassword {
  __typename: 'AuthPayLoad';
  token: string;
}

export const signUpWithPassword = ({
  email,
  password,
  name,
  jwtToken,
}: {
  email: string;
  password: string;
  name: string;
  jwtToken: string;
}): Promise<ISignUpWithPassword> => {
  const mutation = gql`
    mutation SignUpWithPassword(
      $email: String!
      $password: String!
      $name: String!
      $jwtToken: String!
    ) {
      signUpWithPassword(
        email: $email
        password: $password
        name: $name
        jwtToken: $jwtToken
      ) {
        token
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { signUpWithPassword },
        } = await client.mutate({
          mutation,
          variables: { email, password, name, jwtToken },
        });
        resolve(signUpWithPassword);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
