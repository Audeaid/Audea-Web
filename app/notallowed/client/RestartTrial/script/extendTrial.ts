import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IExtendTrial {
  __typename: 'UserSubscription'
  id: string
}

export const extendTrial = (token: string): Promise<IExtendTrial> => {
  const mutation = gql`
    mutation ExtendTrialSubscription {
      extendTrialSubscription {
        id
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

        const response = data.extendTrialSubscription as IExtendTrial

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
