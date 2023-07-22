import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetTitle {
  __typename: 'Content'
  title: string | null
}

export const getTitle = async (token: string, contentId: string) => {
  const query = gql`
    query GetOneContent($contentId: String!) {
      getOneContent(contentId: $contentId) {
        title
      }
    }
  `

  try {
    const { data } = await client.query({
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

    return response
  } catch (e) {
    console.error(e)
  }
}
