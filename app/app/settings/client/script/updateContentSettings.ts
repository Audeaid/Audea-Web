import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface IUpdateContentSettings {
  __typename: 'ContentSettings'
  id: string
}

interface Props {
  token: string
  writingStyle: string | null
  outputLanguage: string | null
  typeOfPromptId: string | null
}

export function updateContentSettings({
  token,
  writingStyle,
  outputLanguage,
  typeOfPromptId,
}: Props): Promise<IUpdateContentSettings> {
  const mutation = gql`
    mutation UpdateContentSettings(
      $writingStyle: String
      $outputLanguage: OutputLanguageEnum
      $typeOfPromptId: String
    ) {
      updateContentSettings(
        writingStyle: $writingStyle
        outputLanguage: $outputLanguage
        typeOfPromptId: $typeOfPromptId
      ) {
        id
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors } = await client.mutate({
          mutation,
          variables: {
            writingStyle,
            outputLanguage,
            typeOfPromptId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.getPlatformVote as IUpdateContentSettings

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
