import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface ICreateNewContentSettings {
  __typename: 'ContentSettings';
  outputLanguage:
    | 'TRANSCRIPT'
    | 'ENGLISH'
    | 'BAHASAINDONESIA'
    | 'CHINESE'
    | 'HINDI'
    | 'JAPANESE'
    | 'SPANISH'
    | 'FRENCH'
    | 'RUSSIAN'
    | 'URDU'
    | 'ARABIC'
    | 'ASK';
  writingStyle: string;
  typeOfPromptId: string;
}

export const createNewContentSettings = (
  token: string
): Promise<ICreateNewContentSettings> => {
  const mutation = gql`
    mutation CreateNewContentSettings {
      createNewContentSettings {
        outputLanguage
        writingStyle
        typeOfPromptId
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
};
