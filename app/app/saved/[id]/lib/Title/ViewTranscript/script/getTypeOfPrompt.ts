import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetTypeOfPrompt {
  __typename: 'TypeOfPrompt'
  systemPrompt: string
}

export function getTypeOfPrompt(token: string, typeOfPromptId: string): Promise<IGetTypeOfPrompt | null> {
  const query = gql`
    query GetTypeOfPromptFromId($typeOfPromptId: String!) {
      getTypeOfPromptFromId(typeOfPromptId: $typeOfPromptId) {
        systemPrompt
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
          query,
          variables: {
            typeOfPromptId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.getTypeOfPromptFromId as IGetTypeOfPrompt | null

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
