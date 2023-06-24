import client from '@/utils/graphql';
import { gql } from '@apollo/client';

export interface ICheckSubscription {
  __typename: 'UserSubscription';
  endDate: string;
  startDate: string;
  type: 'TRIAL' | 'MONTHLY' | 'LIFETIME' | 'YEARLY' | 'EARLYADOPTER';
}

export const checkSubscription = (
  token: string
): Promise<ICheckSubscription> => {
  const query = gql`
    query GetUserSubscription {
      getUserSubscription {
        endDate
        startDate
        type
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getUserSubscription },
        } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getUserSubscription);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
