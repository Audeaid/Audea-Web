import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IDeleteAllContent {
  __typename: 'ResponseMessage';
  response: string;
}

export const deleteAllContent = (token: string): Promise<IDeleteAllContent> => {
  const mutation = gql`
    mutation DeleteAllContent {
      deleteAllContent {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { deleteAllContent },
        } = await client.mutate({
          mutation,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(deleteAllContent);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
