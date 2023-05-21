import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface ISearchUserByEmail {
  __typename: 'User';
  id: string;
  signInProvider: string;
}

export const searchUserByEmail = ({
  email,
}: {
  email: string;
}): Promise<ISearchUserByEmail | null> => {
  const query = gql`
    query SearchUserByEmail($email: String!) {
      searchUserByEmail(email: $email) {
        id
        signInProvider
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { searchUserByEmail },
        } = await client.query({
          query,
          variables: {
            email,
          },
        });

        resolve(searchUserByEmail);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
