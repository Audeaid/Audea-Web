import client from '@/utils/graphql';
import { gql } from '@apollo/client';

export interface IDeleteContent {
  __typename: 'ResponseMessage';
  response: string;
}

export const deleteContent = (
  token: string,
  contentId: string
): Promise<IDeleteContent> => {
  const mutation = gql`
    mutation DeleteContent($contentId: String!) {
      deleteContent(contentId: $contentId) {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { deleteContent },
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

        resolve(deleteContent);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
