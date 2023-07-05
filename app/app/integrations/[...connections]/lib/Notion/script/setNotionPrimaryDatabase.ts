import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface ISetNotionPrimaryDatabase {
  __typename: 'ResponseMessage';
  response: string;
}

export const setNotionPrimaryDatabase = (
  token: string,
  id: string,
  automatic: boolean | null | undefined
): Promise<ISetNotionPrimaryDatabase> => {
  const mutation = gql`
    mutation SetNotionPrimaryDatabase(
      $setNotionPrimaryDatabaseId: String!
      $automatic: Boolean
    ) {
      setNotionPrimaryDatabase(
        id: $setNotionPrimaryDatabaseId
        automatic: $automatic
      ) {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { setNotionPrimaryDatabase },
        } = await client.mutate({
          mutation,
          variables: {
            setNotionPrimaryDatabaseId: id,
            automatic,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(setNotionPrimaryDatabase);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
