import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IUpdateContentSettings {
  __typename: 'ContentSettings';
  id: string;
}

export const updateContentSettings = ({
  token,
  outputLanguage,
}: {
  token: string;
  outputLanguage: string;
}): Promise<IUpdateContentSettings> => {
  const mutation = gql`
    mutation UpdateContentSettings($outputLanguage: OutputLanguageEnum) {
      updateContentSettings(outputLanguage: $outputLanguage) {
        id
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { updateContentSettings },
        } = await client.mutate({
          mutation,
          variables: {
            outputLanguage,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(updateContentSettings);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
