import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface ICreateSharedContent {
  __typename: 'SharedContent'
  username: string
  generatedId: string
}

interface Props {
  token: string
  contentId: string
}

export function createSharedContent({ token, contentId }: Props): Promise<ICreateSharedContent> {
  const mutation = gql`
    mutation CreateSharedContent($contentId: String!) {
      createSharedContent(contentId: $contentId) {
        username
        generatedId
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
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.createSharedContent as ICreateSharedContent

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
