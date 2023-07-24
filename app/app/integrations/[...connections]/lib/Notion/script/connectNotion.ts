import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IConnectNotion {
  __typename: 'NotionAccount'
  workspaceName: string
  workspaceIcon: string | null
}

export function connectNotion(token: string, notionCode: string): Promise<IConnectNotion> {
  const mutation = gql`
    mutation ConnectNotionAccount($notionCode: String!) {
      connectNotionAccount(notionCode: $notionCode) {
        workspaceName
        workspaceIcon
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors } = await client.mutate({
          mutation,
          variables: {
            notionCode,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.connectNotionAccount as IConnectNotion

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
