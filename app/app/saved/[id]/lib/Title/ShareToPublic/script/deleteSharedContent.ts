import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface IDeleteSharedContent {
  __typename: 'SharedContent'
  id: string
}

interface Props {
  token: string
  contentId: string
}

export function deleteSharedContent({ token, contentId }: Props): Promise<IDeleteSharedContent> {
  const mutation = gql`
    mutation DeleteSharedContent($contentId: String!) {
      deleteSharedContent(contentId: $contentId) {
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
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.deleteSharedContent as IDeleteSharedContent

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
