import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface IGetDeletedUser {
  __typename: 'DeletedUser'
  response: string
}

export const getDeletedUser = ({ email }: { email: string }): Promise<IGetDeletedUser> => {
  const query = gql`
    query GetDeletedUser($email: String!) {
      getDeletedUser(email: $email) {
        email
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
          query,
          variables: {
            email,
          },
          fetchPolicy: 'network-only',
        })

        const response = data.getDeletedUser as IGetDeletedUser

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
