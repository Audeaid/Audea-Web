import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface ICreateNewContentSettings {
  __typename: 'ContentSettings'
  id: string
}

export async function createNewContentSettings(token: string) {
  const mutation = gql`
    mutation CreateNewContentSettings {
      createNewContentSettings {
        id
      }
    }
  `

  try {
    const { data } = await client.mutate({
      mutation,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    const response = data.createNewContentSettings as ICreateNewContentSettings

    return response
  } catch (e) {
    console.error(e)
  }
}
