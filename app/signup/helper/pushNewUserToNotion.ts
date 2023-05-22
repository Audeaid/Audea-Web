import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IPushNewUserToNotion {
  __typename: 'ResponseMessage';
  response: string;
}

export const pushNewUserToNotion = ({
  email,
  name,
}: {
  email: string;
  name: string;
}): Promise<IPushNewUserToNotion> => {
  const query = gql`
    query PushNewUserToNotion($email: String!, $name: String!) {
      pushNewUserToNotion(email: $email, name: $name) {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { pushNewUserToNotion },
        } = await client.query({
          query,
          variables: {
            email,
            name,
          },
          fetchPolicy: 'network-only',
        });

        resolve(pushNewUserToNotion);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
