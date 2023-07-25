import { IOutputLanguageType } from '@/app/data/outputLanguage'
import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetContentSettings {
  __typename: 'ContentSettings'
  outputLanguage: IOutputLanguageType
  writingStyle: string
  typeOfPromptId: string
}

export function getContentSettings(token: string): Promise<IGetContentSettings | null> {
  const query = gql`
    query GetContentSettings {
      getContentSettings {
        outputLanguage
        writingStyle
        typeOfPromptId
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

        const response = data.getContentSettings as IGetContentSettings | null

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
