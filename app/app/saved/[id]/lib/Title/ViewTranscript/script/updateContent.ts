import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IUpdateContent {
  __typename: 'Content'
  id: string
}

interface Props {
  token: string
  contentId: string
  title?: string | null
  transcript?: string | null
  gptGenerated?: string | null
}

export function updateContent({ token, contentId, title, transcript, gptGenerated }: Props): Promise<IUpdateContent> {
  const mutation = gql`
    mutation UpdateContent($contentId: String!, $transcript: String, $gptGenerated: String, $title: String) {
      updateContent(contentId: $contentId, transcript: $transcript, gptGenerated: $gptGenerated, title: $title) {
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
            title: title ?? null,
            transcript: transcript ?? null,
            gptGenerated: gptGenerated ?? null,
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
