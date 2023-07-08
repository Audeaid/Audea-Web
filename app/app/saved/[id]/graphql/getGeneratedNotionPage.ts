import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetGeneratedNotionPage {
  __typename: 'GeneratedNotionPage';
  url: string;
}

export const getGeneratedNotionPage = (
  token: string,
  contentId: string
): Promise<IGetGeneratedNotionPage | null> => {
  const query = gql`
    query GetGeneratedNotionPage($contentId: String!) {
      getGeneratedNotionPage(contentId: $contentId) {
        url
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getGeneratedNotionPage },
        } = await client.query({
          query,
          variables: { contentId },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getGeneratedNotionPage);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
