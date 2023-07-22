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

export const sendUserEmail = async ({ token, email, firstName, lastName }: Props) => {
  const query = gql`
    query SendInvitationEmailFromUser($email: String!, $firstName: String!, $lastName: String!) {
      sendInvitationEmailFromUser(email: $email, firstName: $firstName, lastName: $lastName) {
        response
      }
    }
  `

  try {
    const { data } = await client.query({
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

    return response
  } catch (e) {
    console.error(e)
  }
}
