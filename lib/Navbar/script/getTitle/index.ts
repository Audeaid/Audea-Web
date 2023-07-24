import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetTitle {
  __typename: 'Content'
  title: string | null
}

export function getTitle(token: string, contentId: string): Promise<IGetTitle> {
  const query = gql`
    query GetOneContent($contentId: String!) {
      getOneContent(contentId: $contentId) {
        title
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

        const response = data.getOneContent as IGetTitle

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
