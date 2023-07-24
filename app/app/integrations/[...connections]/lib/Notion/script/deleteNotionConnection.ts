import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IDeleteNotionConnection {
  __typename: 'ResponseMessage'
  response: string
}

export function deleteNotionConnection(token: string): Promise<IDeleteNotionConnection> {
  const mutation = gql`
    mutation DeletingNotionConnection {
      deletingNotionConnection {
        response
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

        const response = data.deletingNotionConnection as IDeleteNotionConnection

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
