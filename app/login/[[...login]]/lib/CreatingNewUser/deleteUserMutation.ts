import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IDeleteUserMutation {
  __typename: 'ResponseMessage';
  response: string;
}

export const deleteUserMutation = (
  id: string
): Promise<IDeleteUserMutation> => {
  const mutation = gql`
    mutation DeleteUserIfRegistrationFailed(
      $deleteUserIfRegistrationFailedId: String!
      $secret: String!
    ) {
      deleteUserIfRegistrationFailed(
        id: $deleteUserIfRegistrationFailedId
        secret: $secret
      ) {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { deleteUserIfRegistrationFailed },
        } = await client.mutate({
          mutation,
          variables: {
            id,
            secret: process.env.NEXT_PUBLIC_DELETE_USER_SECRET!,
          },
        });
        resolve(deleteUserIfRegistrationFailed);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
