import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetTitle {
  __typename: 'Content';
  title: string | null;
}

export const getTitle = (
  token: string,
  contentId: string
): Promise<IGetTitle> => {
  const query = gql`
    query GetOneContent($contentId: String!) {
      getOneContent(contentId: $contentId) {
        title
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getOneContent },
        } = await client.query({
          query,
          variables: {
            contentId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getOneContent);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
