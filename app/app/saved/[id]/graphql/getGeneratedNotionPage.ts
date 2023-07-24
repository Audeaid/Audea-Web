import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetGeneratedNotionPage {
  __typename: 'GeneratedNotionPage'
  url: string
}

export function getGeneratedNotionPage(token: string, contentId: string): Promise<IGetGeneratedNotionPage | null> {
  const query = gql`
    query GetGeneratedNotionPage($contentId: String!) {
      getGeneratedNotionPage(contentId: $contentId) {
        url
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

        const response = data.getGeneratedNotionPage as IGetGeneratedNotionPage | null

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
