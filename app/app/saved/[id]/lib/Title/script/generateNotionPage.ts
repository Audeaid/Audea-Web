import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGenerateNotionPage {
  __typename: 'GeneratedNotionPage';
  url: string;
}

export const generateNotionPage = (
  token: string,
  contentId: string,
  notionTitleName: string
): Promise<IGenerateNotionPage> => {
  const mutation = gql`
    mutation GenerateNotionPage(
      $contentId: String!
      $notionTitleName: String!
    ) {
      generateNotionPage(
        contentId: $contentId
        notionTitleName: $notionTitleName
      ) {
        url
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { generateNotionPage },
        } = await client.mutate({
          mutation,
          variables: {
            contentId,
            notionTitleName,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(generateNotionPage);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
