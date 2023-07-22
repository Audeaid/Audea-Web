import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface ISearchUserByClerkId {
  __typename: 'User'
  id: string
}

export const searchUserByClerkId = async (clerkUserId: string) => {
  const query = gql`
    query SearchUserByClerkId($clerkUserId: String!) {
      searchUserByClerkId(clerkUserId: $clerkUserId) {
        id
      }
    }
  `

  try {
    const { data } = await client.query({
      query,
      variables: {
        clerkUserId,
      },
      fetchPolicy: 'network-only',
    })

    const response = data.searchUserByClerkId as ISearchUserByClerkId | null

    return response
  } catch (e) {
    console.error(e)
  }
}
