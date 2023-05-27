import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IChangePassword {
  __typename: 'AuthPayLoad';
  token: string;
}

export const changePassword = ({
  email,
  password,
  jwtToken,
}: {
  email: string;
  password: string;
  jwtToken: string;
}): Promise<IChangePassword> => {
  const mutation = gql`
    mutation ChangePassword(
      $email: String!
      $password: String!
      $jwtToken: String!
    ) {
      changePassword(email: $email, password: $password, jwtToken: $jwtToken) {
        token
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { changePassword },
        } = await client.mutate({
          mutation,
          variables: { email, password, jwtToken },
        });
        resolve(changePassword);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
