import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface ISendNewUserEmail {
  __typename: 'ResponseMessage';
  response: string;
}

export const sendNewUserEmail = ({
  email,
  name,
}: {
  email: string;
  name: string;
}): Promise<ISendNewUserEmail> => {
  const query = gql`
    query SendNewUserEmail($email: String!, $name: String!) {
      sendNewUserEmail(email: $email, name: $name) {
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
            name,
          },
          fetchPolicy: 'network-only',
        });

        resolve(sendNewUserEmail);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
