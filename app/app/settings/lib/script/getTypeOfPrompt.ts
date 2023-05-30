import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetTypeOfPrompt {
  __typename: 'TypeOfPrompt';
  id: string;
  displayName: string;
}

export const getTypeOfPrompt = (token: string): Promise<IGetTypeOfPrompt[]> => {
  const query = gql`
    query GetAllTypeOfPrompt {
      getAllTypeOfPrompt {
        displayName
        id
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getAllTypeOfPrompt },
        } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getAllTypeOfPrompt);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
