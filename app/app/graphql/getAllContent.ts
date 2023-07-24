import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetAllContent {
  __typename: 'Content'
  id: string
}

export function getAllContent(token: string): Promise<IGetAllContent[] | null> {
  const query = gql`
    query GetAllContent {
      getAllContent {
        id
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.getAllContent as IGetAllContent[] | null

        if (errors) {
          reject(errors)
        } else if (error) {
          reject(error)
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
