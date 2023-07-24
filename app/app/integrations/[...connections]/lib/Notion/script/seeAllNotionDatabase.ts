import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface ISeeAllNotionDatabase {
  __typename: 'NotionDatabase'
  icon: string | null
  id: string
  title: string
  url: string | null
}

export function seeAllNotionDatabase(token: string): Promise<ISeeAllNotionDatabase[] | null> {
  const query = gql`
    query GetAllAllowedNotionDatabase {
      getAllAllowedNotionDatabase {
        icon
        id
        title
        url
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

        const response = data.getAllAllowedNotionDatabase as ISeeAllNotionDatabase[] | null

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
