import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface ICreateNewContent {
  __typename: 'Content';
  id: string;
}

export const createNewContent = (token: string): Promise<ICreateNewContent> => {
  const mutation = gql`
    mutation CreateNewContent {
      createNewContent {
        id
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { createNewContent },
        } = await client.mutate({
          mutation,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(createNewContent);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
