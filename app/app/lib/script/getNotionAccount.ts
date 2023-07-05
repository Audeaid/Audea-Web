import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetNotionAccount {
  __typename: 'NotionAccount';
  accessToken: string;
  automaticPost: boolean;
  primaryDatabase: string | null;
}

export const getNotionAccount = (
  token: string
): Promise<IGetNotionAccount | null> => {
  const query = gql`
    query GetNotionAccount {
      getNotionAccount {
        accessToken
        automaticPost
        primaryDatabase
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getNotionAccount },
        } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getNotionAccount);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
