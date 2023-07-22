import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetStripeCustomer {
  __typename: 'StripeCustomer'
  stripeCustomerId: string
}

export function getStripeCustomer(token: string): Promise<IGetStripeCustomer | null> {
  const query = gql`
    query GetStripeCustomer {
      getStripeCustomer {
        stripeCustomerId
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

        const response = data.getStripeCustomer as IGetStripeCustomer | null

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
