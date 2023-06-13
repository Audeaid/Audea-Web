import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface ICheckIfVoted {
  __typename: 'PlatformVoteUser';
  voted: boolean;
}

export const checkIfVoted = (
  token: string,
  platform: string
): Promise<ICheckIfVoted> => {
  const query = gql`
    query CheckIfAlreadyVotedPlatform($platform: PlatformVoteEnum!) {
      checkIfAlreadyVotedPlatform(platform: $platform) {
        voted
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { checkIfAlreadyVotedPlatform },
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

        resolve(checkIfAlreadyVotedPlatform);
      } catch (e) {
        reject(JSON.stringify(e));
      }
    })();
  });
};
