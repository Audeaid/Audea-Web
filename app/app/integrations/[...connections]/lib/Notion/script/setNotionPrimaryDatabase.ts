import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface ISetNotionPrimaryDatabase {
  __typename: 'ResponseMessage'
  response: string
}

export function setNotionPrimaryDatabase(
  token: string,
  id: string,
  automatic: boolean | null | undefined,
): Promise<ISetNotionPrimaryDatabase> {
  const mutation = gql`
    mutation SetNotionPrimaryDatabase($setNotionPrimaryDatabaseId: String!, $automatic: Boolean) {
      setNotionPrimaryDatabase(id: $setNotionPrimaryDatabaseId, automatic: $automatic) {
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
            setNotionPrimaryDatabaseId: id,
            automatic,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.setNotionPrimaryDatabase as ISetNotionPrimaryDatabase

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
