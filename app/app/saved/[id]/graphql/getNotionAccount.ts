import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetNotionAccount {
  __typename: 'NotionAccount'
  accessToken: string
}

export function getNotionAccount(token: string): Promise<IGetNotionAccount | null> {
  const query = gql`
    query GetNotionAccount {
      getNotionAccount {
        accessToken
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

        const response = data.getNotionAccount as IGetNotionAccount | null

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
