import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IGetUsername {
  __typename: 'User';
  username: string | null;
  firstName: string;
  lastName: string;
}

export const getUsername = ({
  token,
}: {
  token: string;
}): Promise<IGetUsername> => {
  const query = gql`
    query GetUserInfo {
      getUserInfo {
        username
        firstName
        lastName
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getUserInfo },
        } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getUserInfo);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
