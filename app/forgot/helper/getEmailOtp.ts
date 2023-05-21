import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IGetEmailOtp {
  __typename: 'ResponseMessage';
  response: string;
}

export const getEmailOtp = ({
  email,
}: {
  email: string;
}): Promise<IGetEmailOtp> => {
  const query = gql`
    query GetEmailOtp($email: String!) {
      getEmailOtp(email: $email) {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getEmailOtp },
        } = await client.query({
          query,
          variables: {
            email,
          },
        });

        resolve(getEmailOtp);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
