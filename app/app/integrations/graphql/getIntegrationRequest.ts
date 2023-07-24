import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetIntegrationRequest {
  __typename: 'RequestedIntegration'
  requested: boolean
}

export function getIntegrationRequest(token: string, integration: string): Promise<IGetIntegrationRequest | null> {
  const query = gql`
    query GetIntegrationRequest($integration: IntegrationsEnum!) {
      getIntegrationRequest(integration: $integration) {
        requested
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
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
        })

        const response = data.getIntegrationRequest as IGetIntegrationRequest | null

        if (errors) {
          reject(errors)
        } else if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      } catch (e) {
        reject(e)
      }
    }

    fetchData()
  })
}
