import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IPushIssue {
  __typename: 'ResponseMessage';
  response: string;
}

export const pushIssue = ({
  token,
  area,
  severityLevel,
  subject,
  description,
}: {
  token: string;
  area: string;
  severityLevel: string;
  subject: string;
  description: string;
}): Promise<IPushIssue> => {
  const query = gql`
    query PushSupportTicket(
      $area: String!
      $severityLevel: String!
      $subject: String!
      $description: String!
    ) {
      pushSupportTicket(
        area: $area
        severityLevel: $severityLevel
        subject: $subject
        description: $description
      ) {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { pushSupportTicket },
        } = await client.query({
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
        });

        resolve(pushSupportTicket);
      } catch (e) {
        reject(JSON.stringify(e));
      }
    })();
  });
};
