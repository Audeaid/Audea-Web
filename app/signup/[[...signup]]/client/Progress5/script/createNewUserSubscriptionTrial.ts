import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface ICreateNewUserSubscriptionTrial {
  __typename: 'UserSubscription'
  id: string
}

export const createNewUserSubscriptionTrial = (token: string): Promise<ICreateNewUserSubscriptionTrial> => {
  const mutation = gql`
    mutation CreateNewUserSubscription($type: SubscriptionTypeEnum!) {
      createNewUserSubscription(type: $type) {
        id
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors } = await client.mutate({
          mutation,
          variables: {
            type: 'EARLYADOPTER',
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.createNewUserSubscription as ICreateNewUserSubscriptionTrial

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
