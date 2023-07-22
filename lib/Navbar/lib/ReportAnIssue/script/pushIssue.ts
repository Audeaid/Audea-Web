import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IPushIssue {
  __typename: 'ResponseMessage'
  response: string
}

interface Props {
  token: string
  area: string
  severityLevel: string
  subject: string
  description: string
}

export function pushIssue({ token, area, severityLevel, subject, description }: Props): Promise<IPushIssue> {
  const query = gql`
    query PushSupportTicket($area: String!, $severityLevel: String!, $subject: String!, $description: String!) {
      pushSupportTicket(area: $area, severityLevel: $severityLevel, subject: $subject, description: $description) {
        response
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
          query,
          variables: {
            area,
            severityLevel,
            subject,
            description,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.pushSupportTicket as IPushIssue

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
