import { gql } from '@apollo/client'
import { IGetPaidObject } from './getPaidObject'
import client from '@/utils/graphql'

export function createPaidObject(token: string, sessionId: string): Promise<IGetPaidObject> {
  const mutation = gql`
    mutation CreatePaidObject($sessionId: String!) {
      createPaidObject(sessionId: $sessionId) {
        redeem
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors } = await client.mutate({
          mutation,
          variables: {
            sessionId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.createPaidObject as IGetPaidObject

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
