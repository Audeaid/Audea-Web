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

export const pushIssue = async ({ token, area, severityLevel, subject, description }: Props) => {
  const query = gql`
    query PushSupportTicket($area: String!, $severityLevel: String!, $subject: String!, $description: String!) {
      pushSupportTicket(area: $area, severityLevel: $severityLevel, subject: $subject, description: $description) {
        response
      }
    }
  `

  try {
    const { data } = await client.query({
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

    return response
  } catch (e) {
    console.error(e)
  }
}
