import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetPaidObject {
  __typename: 'StripePaidObject';
  redeem: boolean;
}

export const getPaidObject = (
  token: string,
  sessionId: string
): Promise<IGetPaidObject | null> => {
  const query = gql`
    query GetPaidObject($sessionId: String!) {
      getPaidObject(sessionId: $sessionId) {
        redeem
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getPaidObject },
        } = await client.query({
          query,
          variables: {
            sessionId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getPaidObject);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
