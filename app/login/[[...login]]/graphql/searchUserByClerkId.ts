import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface ISearchUserByClerkId {
  __typename: 'User';
  id: string;
}

export const searchUserByClerkId = (
  clerkUserId: string
): Promise<ISearchUserByClerkId | null> => {
  const query = gql`
    query SearchUserByClerkId($clerkUserId: String!) {
      searchUserByClerkId(clerkUserId: $clerkUserId) {
        id
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { searchUserByClerkId },
        } = await client.query({
          query,
          variables: {
            clerkUserId,
          },
          fetchPolicy: 'network-only',
        });

        resolve(searchUserByClerkId);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
