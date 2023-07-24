import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IUserRequestedIntegration {
  __typename: 'RequestedIntegration'
  requested: boolean
}

export function userRequestedIntegration(token: string, integration: string): Promise<IUserRequestedIntegration> {
  const mutation = gql`
    mutation UserRequestIntegration($integration: IntegrationsEnum!) {
      userRequestIntegration(integration: $integration) {
        requested
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors } = await client.mutate({
          mutation,
          variables: {
            integration,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.userRequestIntegration as IUserRequestedIntegration

        if (errors) {
          reject(errors)
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
