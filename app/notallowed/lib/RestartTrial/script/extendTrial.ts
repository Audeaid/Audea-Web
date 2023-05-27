import client from '@/utils/graphql';
import { gql } from '@apollo/client';

export interface IExtendTrial {
  __typename: 'UserSubscription';
  id: string;
}

export const extendTrial = (token: string): Promise<IExtendTrial> => {
  const mutation = gql`
    mutation ExtendTrialSubscription {
      extendTrialSubscription {
        id
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { extendTrialSubscription },
        } = await client.mutate({
          mutation,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(extendTrialSubscription);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
