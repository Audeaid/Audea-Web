import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface ISendUserEmail {
  __typename: 'ResponseMessage';
  response: string;
}

export const sendUserEmail = ({
  token,
  email,
  firstName,
  lastName,
}: {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}): Promise<ISendUserEmail> => {
  const query = gql`
    query SendInvitationEmailFromUser(
      $email: String!
      $firstName: String!
      $lastName: String!
    ) {
      sendInvitationEmailFromUser(
        email: $email
        firstName: $firstName
        lastName: $lastName
      ) {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { sendInvitationEmailFromUser },
        } = await client.query({
          query,
          variables: {
            email,
            firstName,
            lastName,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(sendInvitationEmailFromUser);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
