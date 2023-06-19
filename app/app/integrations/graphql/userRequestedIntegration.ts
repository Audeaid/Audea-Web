import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IUserRequestedIntegration {
  __typename: 'RequestedIntegration';
  requested: boolean;
}

export const userRequestedIntegration = (
  token: string,
  integration: string
): Promise<IUserRequestedIntegration> => {
  const mutation = gql`
    mutation UserRequestIntegration($integration: IntegrationsEnum!) {
      userRequestIntegration(integration: $integration) {
        requested
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { userRequestIntegration },
        } = await client.mutate({
          mutation,
          variables: {
            integration,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(userRequestIntegration);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
