import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface ISendNewUserEmail {
  __typename: 'ResponseMessage'
  response: string
}

interface Prop {
  email: string
  name: string
}

export const sendNewUserEmail = async ({ email, name }: Prop) => {
  const query = gql`
    query SendNewUserEmail($email: String!, $name: String!) {
      sendNewUserEmail(email: $email, name: $name) {
        response
      }
    }
  `

  try {
    const { data } = await client.query({
      query,
      variables: {
        email,
        name,
      },
      fetchPolicy: 'network-only',
    })

    const response = data.sendNewUserEmail as ISendNewUserEmail

    return response
  } catch (e) {
    console.error(e)
  }
}
