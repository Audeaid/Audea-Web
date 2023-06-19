import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetIntegrationRequest {
  __typename: 'RequestedIntegration';
  requested: boolean;
}

export const getIntegrationRequest = (
  token: string,
  integration: string
): Promise<IGetIntegrationRequest | null> => {
  const query = gql`
    query GetIntegrationRequest($integration: IntegrationsEnum!) {
      getIntegrationRequest(integration: $integration) {
        requested
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getIntegrationRequest },
        } = await client.query({
          query,
          variables: {
            integration,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getIntegrationRequest);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
