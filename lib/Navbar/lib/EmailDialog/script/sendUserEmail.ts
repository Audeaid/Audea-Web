import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface ISendUserEmail {
  __typename: 'ResponseMessage'
  response: string
}

interface Props {
  token: string
  email: string
  firstName: string
  lastName: string
}

export function sendUserEmail({ token, email, firstName, lastName }: Props): Promise<ISendUserEmail> {
  const query = gql`
    query SendInvitationEmailFromUser($email: String!, $firstName: String!, $lastName: String!) {
      sendInvitationEmailFromUser(email: $email, firstName: $firstName, lastName: $lastName) {
        response
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
            firstName,
            lastName,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.sendInvitationEmailFromUser as ISendUserEmail

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
