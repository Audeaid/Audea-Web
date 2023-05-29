import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetAllTypeOfPrompt {
  __typename: 'ContentSettings';
  id: string;
  displayName: string;
}

export const getAllTypeOfPrompt = ({
  token,
}: {
  token: string;
}): Promise<IGetAllTypeOfPrompt[]> => {
  const query = gql`
    query GetAllTypeOfPrompt {
      getAllTypeOfPrompt {
        id
        displayName
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
