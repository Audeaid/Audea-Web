import client from '$utils/graphql';
import { gql } from '@apollo/client';
import axios from 'axios';

export const addUsername = ({
  token,
  username,
  clerkUserId,
}: {
  token: string;
  username: string;
  clerkUserId: string;
}): Promise<any> => {
  const mutation = gql`
    mutation AddUsername($username: String!) {
      addUsername(username: $username) {
        id
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { addUsername },
        } = await client.mutate({
          mutation,
          variables: {
            username,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        const { data: axiosResponse } = await axios.post(
          '/api/addUsernameToClerk',
          {
            clerkUserId,
            username,
          }
        );

        resolve({ graphQLResponse: addUsername, axiosResponse });
      } catch (e) {
        reject(e);
      }
    })();
  });
};
