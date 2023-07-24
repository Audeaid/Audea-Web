import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface ICreateNewContent {
  __typename: 'Content'
  id: string
}

export function createNewContent(token: string): Promise<ICreateNewContent> {
  const mutation = gql`
    mutation CreateNewContent {
      createNewContent {
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
          fetchPolicy: 'network-only',
        })

        const response = data.createNewContent as ICreateNewContent

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
