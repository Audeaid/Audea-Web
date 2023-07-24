import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface ICreateNewContentSettings {
  __typename: 'ContentSettings'
  id: string
}

export const createNewContentSettings = (token: string): Promise<ICreateNewContentSettings> => {
  const mutation = gql`
    mutation CreateNewContentSettings {
      createNewContentSettings {
        id
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors } = await client.mutate({
          mutation,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.createNewContentSettings as ICreateNewContentSettings

        if (errors) {
          reject(errors)
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
