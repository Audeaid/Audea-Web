import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface ISearchUserByClerkId {
  __typename: 'User'
  id: string
}

export function searchUserByClerkId(clerkUserId: string): Promise<ISearchUserByClerkId | null> {
  const query = gql`
    query SearchUserByClerkId($clerkUserId: String!) {
      searchUserByClerkId(clerkUserId: $clerkUserId) {
        id
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
          query,
          variables: {
            clerkUserId,
          },
          fetchPolicy: 'network-only',
        })

        const response = data.searchUserByClerkId as ISearchUserByClerkId | null

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
