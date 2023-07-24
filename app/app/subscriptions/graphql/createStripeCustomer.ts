import { gql } from '@apollo/client'
import { IGetStripeCustomer } from './getStripeCustomer'
import client from '@/utils/graphql'

export function createStripeCustomer(token: string): Promise<IGetStripeCustomer> {
  const mutation = gql`
    mutation CreateStripeCustomer {
      createStripeCustomer {
        stripeCustomerId
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors } = await client.mutate({
          mutation,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.createStripeCustomer as IGetStripeCustomer

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
