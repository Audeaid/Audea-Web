import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IUpdateContentSettings {
  __typename: 'ContentSettings';
  id: string;
}

export const updateContentSettings = ({
  token,
  writingStyle,
}: {
  token: string;
  writingStyle: string;
}): Promise<IUpdateContentSettings> => {
  const mutation = gql`
    mutation UpdateContentSettings($writingStyle: String) {
      updateContentSettings(writingStyle: $writingStyle) {
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
