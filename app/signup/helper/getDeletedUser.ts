import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IGetDeletedUser {
  __typename: 'DeletedUser';
  response: string;
}

export const getDeletedUser = ({
  email,
}: {
  email: string;
}): Promise<IGetDeletedUser> => {
  const query = gql`
    query GetDeletedUser($email: String!) {
      getDeletedUser(email: $email) {
        email
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getDeletedUser },
        } = await client.query({
          query,
          variables: {
            email,
          },
          fetchPolicy: 'network-only',
        });

        resolve(getDeletedUser);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
