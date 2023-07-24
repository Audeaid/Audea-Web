import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetNotionTitleName {
  __typename: 'ResponseMessage'
  response: string
}

export function getNotionTitleName(token: string): Promise<IGetNotionTitleName> {
  const query = gql`
    query GetNotionTitleName {
      getNotionTitleName {
        response
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.getNotionTitleName as IGetNotionTitleName

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
