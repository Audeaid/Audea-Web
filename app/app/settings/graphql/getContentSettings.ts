import { gql } from '@apollo/client'
import { IContentSettings } from './createNewContentSettings'
import client from '@/utils/graphql'

export function getContentSettings(token: string): Promise<IContentSettings | null> {
  const query = gql`
    query GetContentSettings {
      getContentSettings {
        id
        lastUpdate
        outputLanguage
        typeOfPromptId
        writingStyle
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

        const response = data.getContentSettings as IContentSettings | null

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
