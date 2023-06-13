import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface ICreateUserFromClerk {
  __typename: 'User';
  id: string;
  clerkUserId: string;
}

export const createUserFromClerk = ({
  email,
  clerkId,
  firstName,
  lastName,
  referralJwt,
}: {
  email: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  referralJwt: string | null;
}): Promise<ICreateUserFromClerk> => {
  const mutation = gql`
    mutation CreateUserFromClerk(
      $email: String!
      $clerkId: String!
      $firstName: String!
      $lastName: String!
      $referralJwt: String
    ) {
      createUserFromClerk(
        email: $email
        clerkId: $clerkId
        firstName: $firstName
        lastName: $lastName
        referralJwt: $referralJwt
      ) {
        id
        clerkUserId
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { createUserFromClerk },
        } = await client.mutate({
          mutation,
          variables: { email, clerkId, firstName, lastName, referralJwt },
        });
        resolve(createUserFromClerk);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
