import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetStripeCustomer {
  __typename: 'StripeCustomer';
  stripeCustomerId: string;
}

export const getStripeCustomer = (
  token: string
): Promise<IGetStripeCustomer | null> => {
  const query = gql`
    query GetStripeCustomer {
      getStripeCustomer {
        stripeCustomerId
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getStripeCustomer },
        } = await client.query({
          query,

          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getStripeCustomer);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
