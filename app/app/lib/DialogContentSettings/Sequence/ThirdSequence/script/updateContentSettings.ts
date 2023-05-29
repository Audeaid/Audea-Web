import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IUpdateContentSettings {
  __typename: 'ContentSettings';
  id: string;
}

export const updateContentSettings = ({
  token,
  typeOfPromptId,
}: {
  token: string;
  typeOfPromptId: string;
}): Promise<IUpdateContentSettings> => {
  const mutation = gql`
    mutation UpdateContentSettings($typeOfPromptId: String) {
      updateContentSettings(typeOfPromptId: $typeOfPromptId) {
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
