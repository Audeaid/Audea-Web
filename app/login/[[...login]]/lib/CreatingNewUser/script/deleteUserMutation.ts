import { PUBLIC_DELETE_USER_SECRET } from '@/utils/constant'
import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface IDeleteUserMutation {
  __typename: 'ResponseMessage'
  response: string
}

export function deleteUserMutation(id: string): Promise<IDeleteUserMutation> {
  const mutation = gql`
    mutation DeleteUserIfRegistrationFailed($deleteUserIfRegistrationFailedId: String!, $secret: String!) {
      deleteUserIfRegistrationFailed(id: $deleteUserIfRegistrationFailedId, secret: $secret) {
        response
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors } = await client.mutate({
          mutation,
          variables: {
            id,
            secret: PUBLIC_DELETE_USER_SECRET,
          },
        })

        const response = data.deleteUserIfRegistrationFailed as IDeleteUserMutation

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
