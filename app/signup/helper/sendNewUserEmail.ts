import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface ISendNewUserEmail {
  __typename: 'ResponseMessage';
  response: string;
}

export const sendNewUserEmail = ({
  email,
}: {
  email: string;
}): Promise<ISendNewUserEmail> => {
  const query = gql`
    query SendNewUserEmail($email: String!) {
      sendNewUserEmail(email: $email) {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { sendNewUserEmail },
        } = await client.query({
          query,
          variables: {
            email,
          },
        });

        resolve(sendNewUserEmail);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
