import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface ISeeAllNotionDatabase {
  __typename: 'NotionDatabase';
  icon: string | null;
  id: string;
  title: string;
  url: string | null;
}

export const seeAllNotionDatabase = (
  token: string
): Promise<ISeeAllNotionDatabase[] | null> => {
  const query = gql`
    query GetAllAllowedNotionDatabase {
      getAllAllowedNotionDatabase {
        icon
        id
        title
        url
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getAllAllowedNotionDatabase },
        } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getAllAllowedNotionDatabase);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
