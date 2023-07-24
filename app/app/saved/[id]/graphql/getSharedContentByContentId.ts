import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetSharedContentByContentId {
  __typename: 'SharedContent'
  generatedId: string
  username: string
}

export function getSharedContentByContentId(
  token: string,
  contentId: string,
): Promise<IGetSharedContentByContentId | null> {
  const query = gql`
    query GetSharedContentByContentId($contentId: String!) {
      getSharedContentByContentId(contentId: $contentId) {
        generatedId
        username
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
          query,
          variables: { contentId },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.getSharedContentByContentId as IGetSharedContentByContentId | null

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
