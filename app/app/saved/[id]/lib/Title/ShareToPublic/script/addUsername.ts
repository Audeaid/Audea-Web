import client from '@/utils/graphql'
import { gql } from '@apollo/client'
import axios from 'axios'

interface Props {
  token: string
  username: string
  clerkUserId: string
}

export const addUsername = ({ token, username, clerkUserId }: Props): Promise<unknown> => {
  const mutation = gql`
    mutation AddUsername($username: String!) {
      addUsername(username: $username) {
        id
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors } = await client.mutate({
          mutation,
          variables: {
            username,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const axiosResponse = await axios.post('/api/clerk/addUsernameToClerk', {
          clerkUserId,
          username,
        })

        if (errors) {
          reject(errors)
        } else {
          resolve({ graphQLResponse: data, axiosResponse })
        }
      } catch (e) {
        reject(e)
      }
    }

    fetchData()
  })
}
