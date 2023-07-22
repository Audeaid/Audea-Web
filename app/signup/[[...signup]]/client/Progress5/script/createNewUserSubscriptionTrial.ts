import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface ICreateNewUserSubscriptionTrial {
  __typename: 'UserSubscription'
  id: string
}

export async function createNewUserSubscriptionTrial(token: string) {
  const mutation = gql`
    mutation CreateNewUserSubscription($type: SubscriptionTypeEnum!) {
      createNewUserSubscription(type: $type) {
        id
      }
    }
  `

  try {
    const { data } = await client.mutate({
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

    return response
  } catch (e) {
    console.error(e)
  }
}
