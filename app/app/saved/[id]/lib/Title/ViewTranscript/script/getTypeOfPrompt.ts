import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetTypeOfPrompt {
  __typename: 'TypeOfPrompt';
  systemPrompt: string;
}

export const getTypeOfPrompt = (
  token: string,
  typeOfPromptId: string
): Promise<IGetTypeOfPrompt | null> => {
  const query = gql`
    query GetTypeOfPromptFromId($typeOfPromptId: String!) {
      getTypeOfPromptFromId(typeOfPromptId: $typeOfPromptId) {
        systemPrompt
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getTypeOfPromptFromId },
        } = await client.query({
          query,
          variables: {
            typeOfPromptId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getTypeOfPromptFromId);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
