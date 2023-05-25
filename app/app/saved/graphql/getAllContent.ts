import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetAllContent {
  __typename: 'Content';
  id: string;
  createdAt: string;
  title: string | null;
}

export const getAllContent = (
  token: string
): Promise<IGetAllContent[] | null> => {
  const query = gql`
    query GetAllContent {
      getAllContent {
        id
        createdAt
        title
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getAllContent },
        } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getAllContent);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
