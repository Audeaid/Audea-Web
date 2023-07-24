import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetTypeOfPrompt {
  __typename: 'TypeOfPrompt'
  id: string
  displayName: string
}

export function getTypeOfPrompt(token: string): Promise<IGetTypeOfPrompt[]> {
  const query = gql`
    query GetAllTypeOfPrompt {
      getAllTypeOfPrompt {
        displayName
        id
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

        const response = data.getAllTypeOfPrompt as IGetTypeOfPrompt[]

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
