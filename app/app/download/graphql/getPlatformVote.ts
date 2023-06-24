import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetPlatformVote {
  __typename: 'PlatformVote';
  count: number;
}

export const getPlatformVote = (
  token: string,
  platform: string
): Promise<IGetPlatformVote> => {
  const query = gql`
    query GetPlatformVote($platform: PlatformVoteEnum!) {
      getPlatformVote(platform: $platform) {
        count
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getPlatformVote },
        } = await client.query({
          query,
          variables: {
            platform,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getPlatformVote);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
