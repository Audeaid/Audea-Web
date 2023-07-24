import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IDeleteContent {
  __typename: 'ResponseMessage'
  response: string
}

export function deleteContent(token: string, contentId: string): Promise<IDeleteContent> {
  const mutation = gql`
    mutation DeleteContent($contentId: String!) {
      deleteContent(contentId: $contentId) {
        response
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

        const response = data.deleteContent as IDeleteContent

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
