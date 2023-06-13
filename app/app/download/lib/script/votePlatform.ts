import client from '@/utils/middlewareGraphql';
import { gql } from '@apollo/client';

interface IVotePlatform {
  __typename: 'PlatformVote';
  count: number;
}

export const votePlatform = (
  token: string,
  platform: string,
  vote: boolean
): Promise<IVotePlatform> => {
  const mutation = gql`
    mutation VotePlatform($platform: PlatformVoteEnum!, $vote: Boolean!) {
      votePlatform(platform: $platform, vote: $vote) {
        count
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { votePlatform },
        } = await client.mutate({
          mutation,
          variables: {
            platform,
            vote,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(votePlatform);
      } catch (e) {
        reject(JSON.stringify(e));
      }
    })();
  });
};
