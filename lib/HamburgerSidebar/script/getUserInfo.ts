import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetUserInfo {
  __typename: 'User';
  email: string;
}

export const getUserInfo = (token: string): Promise<IGetUserInfo> => {
  const query = gql`
    query GetUserInfo {
      getUserInfo {
        email
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
