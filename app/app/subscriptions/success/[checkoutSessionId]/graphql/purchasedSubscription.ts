import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IPurchasedSubscription {
  __typename: 'UserSubscription'
  endDate: string
  type: 'MONTHLY' | 'YEARLY' | 'LIFETIME60'
}

export function purchasedSubscription(
  token: string,
  type: 'MONTHLY' | 'YEARLY' | 'LIFETIME60',
): Promise<IPurchasedSubscription> {
  const mutation = gql`
    mutation PurchasedSubscription($type: SubscriptionTypeEnum!) {
      purchasedSubscription(type: $type) {
        endDate
        type
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors } = await client.mutate({
          mutation,
          variables: {
            type,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.purchasedSubscription as IPurchasedSubscription

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
