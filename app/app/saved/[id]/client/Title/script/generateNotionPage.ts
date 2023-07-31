import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGenerateNotionPage {
  __typename: 'GeneratedNotionPage'
  url: string
}

export function generateNotionPage(
  token: string,
  contentId: string,
  notionTitleName: string,
): Promise<IGenerateNotionPage> {
  const mutation = gql`
    mutation GenerateNotionPage($contentId: String!, $notionTitleName: String!) {
      generateNotionPage(contentId: $contentId, notionTitleName: $notionTitleName) {
        url
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
            notionTitleName,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.generateNotionPage as IGenerateNotionPage

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
