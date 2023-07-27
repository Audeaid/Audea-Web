import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetOneContent {
  __typename: 'Content'
  id: string
  title: string | null
  createdAt: string
  gptGenerated: string | null
  transcript: string | null
  typeOfPromptId: string | null
  s3ObjectName: string | null
  writingStyle: string | null
  outputLanguage: string | null
}

export function getOneContent(token: string, contentId: string): Promise<IGetOneContent> {
  const query = gql`
    query GetOneContent($contentId: String!) {
      getOneContent(contentId: $contentId) {
        createdAt
        gptGenerated
        id
        outputLanguage
        title
        transcript
        typeOfPromptId
        userId
        s3ObjectName
        writingStyle
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
          query,
          variables: {
            contentId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.getOneContent as IGetOneContent

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
