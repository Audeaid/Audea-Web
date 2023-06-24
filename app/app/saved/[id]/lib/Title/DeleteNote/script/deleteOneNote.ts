import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IDeleteOneNote {
  __typename: 'ResponseMessage';
  response: string;
}

export const deleteOneNote = ({
  token,
  contentId,
}: {
  token: string;
  contentId: string;
}): Promise<IDeleteOneNote> => {
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
