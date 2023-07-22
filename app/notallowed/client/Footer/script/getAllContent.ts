import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetAllContent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  __typename: 'Content'
  id: string
  createdAt: string
  title: string | null
  voiceNoteUrl: string | null
  transcript: string | null
  gptGenerated: string | null
  typeOfPromptId: string | null
  userId: string
  writingStyle: string | null
  outputLanguage: string | null
}

export const getAllContent = async (token: string): Promise<IGetAllContent[] | null | undefined> => {
  const query = gql`
    query GetAllContent {
      getAllContent {
        id
        createdAt
        title
        voiceNoteUrl
        transcript
        gptGenerated
        typeOfPromptId
        userId
        writingStyle
        outputLanguage
      }
    }
  `

  try {
    const { data } = await client.query({
      query,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      fetchPolicy: 'network-only',
    })

    const response = data.getAllContent as IGetAllContent[] | null

    return response
  } catch (e) {
    console.error(e)
  }
}
