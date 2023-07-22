import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IExtendTrial {
  __typename: 'UserSubscription'
  id: string
}

export const extendTrial = async (token: string) => {
  const mutation = gql`
    mutation ExtendTrialSubscription {
      extendTrialSubscription {
        id
      }
    }
  `

  try {
    const { data } = await client.mutate({
      mutation,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    const response = data.extendTrialSubscription as IExtendTrial

    return response
  } catch (e) {
    console.error(e)
  }
}
