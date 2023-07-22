import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface ICheckSubscription {
  __typename: 'UserSubscription'
  endDate: string
  startDate: string
  type: 'TRIAL' | 'MONTHLY' | 'LIFETIME' | 'YEARLY' | 'EARLYADOPTER'
}

export function checkSubscription(token: string): Promise<ICheckSubscription> {
  const query = gql`
    query GetUserSubscription {
      getUserSubscription {
        endDate
        startDate
        type
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.getUserSubscription as ICheckSubscription

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
