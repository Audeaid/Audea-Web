import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface ICreateUserFromClerk {
  __typename: 'User'
  id: string
  clerkUserId: string
}

interface Prop {
  email: string
  clerkId: string
  firstName: string
  lastName: string
  referralJwt: string | null
}

export const createUserFromClerk = async ({ email, clerkId, firstName, lastName, referralJwt }: Prop) => {
  const mutation = gql`
    mutation CreateUserFromClerk(
      $email: String!
      $clerkId: String!
      $firstName: String!
      $lastName: String!
      $referralJwt: String
    ) {
      createUserFromClerk(
        email: $email
        clerkId: $clerkId
        firstName: $firstName
        lastName: $lastName
        referralJwt: $referralJwt
      ) {
        id
        clerkUserId
      }
    }
  `

  try {
    const { data } = await client.mutate({
      mutation,
      variables: { email, clerkId, firstName, lastName, referralJwt },
    })

    const response = data.createUserFromClerk as ICreateUserFromClerk

    return response
  } catch (e) {
    console.error(e)
  }
}
