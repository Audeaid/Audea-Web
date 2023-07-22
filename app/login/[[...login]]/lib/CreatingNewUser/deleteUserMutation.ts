import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface IDeleteUserMutation {
  __typename: 'ResponseMessage'
  response: string
}

export const deleteUserMutation = async (id: string) => {
  const mutation = gql`
    mutation DeleteUserIfRegistrationFailed($deleteUserIfRegistrationFailedId: String!, $secret: String!) {
      deleteUserIfRegistrationFailed(id: $deleteUserIfRegistrationFailedId, secret: $secret) {
        response
      }
    }
  `

  try {
    const { data } = await client.mutate({
      mutation,
      variables: {
        id,
        secret: process.env.NEXT_PUBLIC_DELETE_USER_SECRET!,
      },
    })

    const response = data.deleteUserIfRegistrationFailed as IDeleteUserMutation

    return response
  } catch (e) {
    console.error(e)
  }
}
