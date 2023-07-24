import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface IPostForm {
  __typename: 'ResponseMessage'
  response: string
}

export function postForm(token: string, longText: string): Promise<IPostForm> {
  const mutation = gql`
    mutation DreamWorkflowForm($longText: String!) {
      dreamWorkflowForm(longText: $longText) {
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
            longText,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.dreamWorkflowForm as IPostForm

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
