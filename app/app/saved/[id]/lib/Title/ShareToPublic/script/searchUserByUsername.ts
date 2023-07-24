import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface ISearchUserByUsername {
  __typename: 'User'
  id: string
}

interface Props {
  token: string
  username: string
}

export function searchUserByUsername({ token, username }: Props): Promise<ISearchUserByUsername | null> {
  const query = gql`
    query SearchUserByUsername($username: String!) {
      searchUserByUsername(username: $username) {
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
            username,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.searchUserByUsername as ISearchUserByUsername | null

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
