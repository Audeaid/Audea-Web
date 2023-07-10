import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetSharedContentByContentId {
  __typename: 'SharedContent';
  generatedId: string;
  username: string;
}

export const getSharedContentByContentId = (
  token: string,
  contentId: string
): Promise<IGetSharedContentByContentId | null> => {
  const query = gql`
    query GetSharedContentByContentId($contentId: String!) {
      getSharedContentByContentId(contentId: $contentId) {
        generatedId
        username
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getSharedContentByContentId },
        } = await client.query({
          query,
          variables: { contentId },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getSharedContentByContentId);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
