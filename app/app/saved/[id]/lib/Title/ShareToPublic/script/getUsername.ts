import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface IGetUsername {
  __typename: 'User'
  username: string | null
  firstName: string
  lastName: string
}

interface Props {
  token: string
}

export function getUsername({ token }: Props): Promise<IGetUsername> {
  const query = gql`
    query GetUserInfo {
      getUserInfo {
        username
        firstName
        lastName
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

        const response = data.getUserInfo as IGetUsername

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
