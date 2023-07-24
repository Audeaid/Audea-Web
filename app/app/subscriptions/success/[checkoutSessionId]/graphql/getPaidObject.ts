import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetPaidObject {
  __typename: 'StripePaidObject'
  redeem: boolean
}

export function getPaidObject(token: string, sessionId: string): Promise<IGetPaidObject | null> {
  const query = gql`
    query GetPaidObject($sessionId: String!) {
      getPaidObject(sessionId: $sessionId) {
        redeem
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
          query,
          variables: {
            sessionId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.getPaidObject as IGetPaidObject | null

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
