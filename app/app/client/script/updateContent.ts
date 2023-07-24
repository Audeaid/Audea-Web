import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IUpdateContent {
  __typename: 'Content'
  id: string
}

interface Props {
  token: string
  contentId: string
  title: string | null
  voiceNoteUrl: string | null
  transcript: string | null
  gptGenerated: string | null
  typeOfPromptId: string | null
  writingStyle: string | null
  outputLanguage: string | null
}

export function updateContent({
  token,
  contentId,
  title,
  voiceNoteUrl,
  transcript,
  gptGenerated,
  typeOfPromptId,
  writingStyle,
  outputLanguage,
}: Props): Promise<IUpdateContent> {
  const mutation = gql`
    mutation UpdateContent(
      $contentId: String!
      $title: String
      $voiceNoteUrl: String
      $transcript: String
      $gptGenerated: String
      $typeOfPromptId: String
      $writingStyle: String
      $outputLanguage: OutputLanguageEnum
    ) {
      updateContent(
        contentId: $contentId
        title: $title
        voiceNoteUrl: $voiceNoteUrl
        transcript: $transcript
        gptGenerated: $gptGenerated
        typeOfPromptId: $typeOfPromptId
        writingStyle: $writingStyle
        outputLanguage: $outputLanguage
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
            contentId,
            title,
            voiceNoteUrl,
            transcript,
            gptGenerated,
            typeOfPromptId,
            writingStyle,
            outputLanguage,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.updateContent as IUpdateContent

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
