import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetContentSettings {
  __typename: 'ContentSettings';
  id: string;
  lastUpdate: string;
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
  typeOfPromptId: string;
  writingStyle: string;
}

export const getContentSettings = (
  token: string
): Promise<IGetContentSettings | null> => {
  const query = gql`
    query GetContentSettings {
      getContentSettings {
        id
        lastUpdate
        outputLanguage
        typeOfPromptId
        writingStyle
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getContentSettings },
        } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getContentSettings);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
