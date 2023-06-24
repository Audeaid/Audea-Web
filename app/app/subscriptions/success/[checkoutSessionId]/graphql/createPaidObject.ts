import client from '$utils/graphql';
import { gql } from '@apollo/client';
import { IGetPaidObject } from './getPaidObject';

export const createPaidObject = (
  token: string,
  sessionId: string
): Promise<IGetPaidObject> => {
  const mutation = gql`
    mutation CreatePaidObject($sessionId: String!) {
      createPaidObject(sessionId: $sessionId) {
        redeem
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { createPaidObject },
        } = await client.mutate({
          mutation,
          variables: {
            sessionId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(createPaidObject);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
