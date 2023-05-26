import client from '@/utils/graphql';
import { gql } from '@apollo/client';

export interface IDeleteAccount {
  __typename: 'ResponseMessage';
  response: string;
}

export const deleteAccount = (token: string): Promise<IDeleteAccount> => {
  const mutation = gql`
    mutation DeleteAccount {
      deleteAccount {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { deleteAccount },
        } = await client.mutate({
          mutation,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(deleteAccount);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
