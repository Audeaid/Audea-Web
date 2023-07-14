import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IPurchasedSubscription {
  __typename: 'UserSubscription';
  endDate: string;
  type: 'MONTHLY' | 'YEARLY' | 'LIFETIME60';
}

export const purchasedSubscription = (
  token: string,
  type: 'MONTHLY' | 'YEARLY' | 'LIFETIME60'
): Promise<IPurchasedSubscription> => {
  const mutation = gql`
    mutation PurchasedSubscription($type: SubscriptionTypeEnum!) {
      purchasedSubscription(type: $type) {
        endDate
        type
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { purchasedSubscription },
        } = await client.mutate({
          mutation,
          variables: {
            type,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(purchasedSubscription);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
