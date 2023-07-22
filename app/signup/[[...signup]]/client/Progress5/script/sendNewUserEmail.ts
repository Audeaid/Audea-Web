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

export const sendNewUserEmail = ({ email, name }: Prop): Promise<ISendNewUserEmail> => {
  const query = gql`
    query SendNewUserEmail($email: String!, $name: String!) {
      sendNewUserEmail(email: $email, name: $name) {
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
            name,
          },
          fetchPolicy: 'network-only',
        })

        const response = data.sendNewUserEmail as ISendNewUserEmail

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
