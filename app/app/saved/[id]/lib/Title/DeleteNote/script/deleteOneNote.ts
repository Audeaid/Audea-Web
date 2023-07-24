import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface IDeleteOneNote {
  __typename: 'ResponseMessage'
  response: string
}

export function deleteOneNote({ token, contentId }: { token: string; contentId: string }): Promise<IDeleteOneNote> {
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

        const response = data.deleteContent as IDeleteOneNote

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
