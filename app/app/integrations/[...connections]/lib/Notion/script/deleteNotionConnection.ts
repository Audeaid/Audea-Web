import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IDeleteNotionConnection {
  __typename: 'ResponseMessage';
  response: string;
}

export const deleteNotionConnection = (
  token: string
): Promise<IDeleteNotionConnection> => {
  const mutation = gql`
    mutation DeletingNotionConnection {
      deletingNotionConnection {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { deletingNotionConnection },
        } = await client.mutate({
          mutation,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(deletingNotionConnection);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
