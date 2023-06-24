import client from '$utils/graphql';
import { gql } from '@apollo/client';
import { IGetStripeCustomer } from './getStripeCustomer';

export const createStripeCustomer = (
  token: string
): Promise<IGetStripeCustomer> => {
  const mutation = gql`
    mutation CreateStripeCustomer {
      createStripeCustomer {
        stripeCustomerId
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { createStripeCustomer },
        } = await client.mutate({
          mutation,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(createStripeCustomer);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
