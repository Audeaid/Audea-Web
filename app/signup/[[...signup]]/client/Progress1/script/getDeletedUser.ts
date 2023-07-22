import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface IGetDeletedUser {
  __typename: 'DeletedUser'
  response: string
}

export const getDeletedUser = async ({ email }: { email: string }) => {
  const query = gql`
    query GetDeletedUser($email: String!) {
      getDeletedUser(email: $email) {
        email
      }
    }
  `

  try {
    const { data } = await client.query({
      query,
      variables: {
        email,
      },
      fetchPolicy: 'network-only',
    })

    const response = data.getDeletedUser as IGetDeletedUser

    return response
  } catch (e) {
    console.error(e)
  }
}
