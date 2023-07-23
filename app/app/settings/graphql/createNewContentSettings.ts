import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IContentSettings {
  __typename: 'ContentSettings'
  id: string
  lastUpdate: string
  outputLanguage:
    | 'TRANSCRIPT'
    | 'ENGLISH'
    | 'BAHASAINDONESIA'
    | 'CHINESE'
    | 'HINDI'
    | 'JAPANESE'
    | 'SPANISH'
    | 'FRENCH'
    | 'RUSSIAN'
    | 'URDU'
    | 'ARABIC'
    | 'ASK'
  writingStyle: string
  typeOfPromptId: string
}

export function createNewContentSettings(token: string): Promise<IContentSettings> {
  const mutation = gql`
    mutation CreateNewContentSettings {
      createNewContentSettings {
        id
        lastUpdate
        outputLanguage
        typeOfPromptId
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

        const response = data.createNewContentSettings as IContentSettings

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
