import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IUpdateContentSettings {
  __typename: 'ContentSettings';
  id: string;
}

export const updateContentSettings = ({
  token,
  writingStyle,
  outputLanguage,
  typeOfPromptId,
}: {
  token: string;
  writingStyle: string;
  outputLanguage: string;
  typeOfPromptId: string;
}): Promise<IUpdateContentSettings> => {
  const mutation = gql`
    mutation UpdateContentSettings(
      $writingStyle: String
      $outputLanguage: OutputLanguageEnum
      $typeOfPromptId: String
    ) {
      updateContentSettings(
        writingStyle: $writingStyle
        outputLanguage: $outputLanguage
        typeOfPromptId: $typeOfPromptId
      ) {
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
            writingStyle,
            outputLanguage,
            typeOfPromptId,
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
