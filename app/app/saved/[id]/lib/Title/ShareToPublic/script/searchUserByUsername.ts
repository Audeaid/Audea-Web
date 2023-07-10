import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface ISearchUserByUsername {
  __typename: 'User';
  id: string;
}

export const searchUserByUsername = ({
  token,
  username,
}: {
  token: string;
  username: string;
}): Promise<ISearchUserByUsername | null> => {
  const query = gql`
    query SearchUserByUsername($username: String!) {
      searchUserByUsername(username: $username) {
        id
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { searchUserByUsername },
        } = await client.query({
          query,
          variables: {
            username,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(searchUserByUsername);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
