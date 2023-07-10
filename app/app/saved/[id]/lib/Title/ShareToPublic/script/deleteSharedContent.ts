import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IDeleteSharedContent {
  __typename: 'SharedContent';
  id: string;
}

export const deleteSharedContent = ({
  token,
  contentId,
}: {
  token: string;
  contentId: string;
}): Promise<IDeleteSharedContent> => {
  const mutation = gql`
    mutation DeleteSharedContent($contentId: String!) {
      deleteSharedContent(contentId: $contentId) {
        id
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { deleteSharedContent },
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

        resolve(deleteSharedContent);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
