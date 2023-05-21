import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface ICreateNewUserSubscriptionTrial {
  __typename: 'UserSubscription';
  id: string;
}

export async function createNewUserSubscriptionTrial(
  token: string
): Promise<ICreateNewUserSubscriptionTrial> {
  const mutation = gql`
    mutation CreateNewUserSubscription($type: SubscriptionTypeEnum!) {
      createNewUserSubscription(type: $type) {
        id
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { createNewUserSubscription },
        } = await client.mutate({
          mutation,
          variables: {
            type: 'EARLYADOPTER',
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(createNewUserSubscription);
      } catch (e) {
        reject(e);
      }
    })();
  });
}
