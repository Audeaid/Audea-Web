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

export const getAllContent = (token: string): Promise<IGetAllContent[] | null> => {
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

        const response = data.getAllContent as IGetAllContent[] | null

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
