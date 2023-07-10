import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface ICreateSharedContent {
  __typename: 'SharedContent';
  username: string;
  generatedId: string;
}

export const createSharedContent = ({
  token,
  contentId,
}: {
  token: string;
  contentId: string;
}): Promise<ICreateSharedContent> => {
  const mutation = gql`
    mutation CreateSharedContent($contentId: String!) {
      createSharedContent(contentId: $contentId) {
        username
        generatedId
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { createSharedContent },
        } = await client.mutate({
          mutation,
          variables: {
            contentId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(createSharedContent);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
