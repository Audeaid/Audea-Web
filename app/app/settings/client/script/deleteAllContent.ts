import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface IDeleteAllContent {
  __typename: 'ResponseMessage'
  response: string
}

export function deleteAllContent(token: string): Promise<IDeleteAllContent> {
  const mutation = gql`
    mutation DeleteAllContent {
      deleteAllContent {
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

        const response = data.deleteAllContent as IDeleteAllContent

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
