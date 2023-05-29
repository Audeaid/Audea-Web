import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface ICreateNewContentSettings {
  __typename: 'ContentSettings';
  id: string;
}

export async function createNewContentSettings(
  token: string
): Promise<ICreateNewContentSettings> {
  const mutation = gql`
    mutation CreateNewContentSettings {
      createNewContentSettings {
        id
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { createNewContentSettings },
        } = await client.mutate({
          mutation,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(createNewContentSettings);
      } catch (e) {
        reject(e);
      }
    })();
  });
}
