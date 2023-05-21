import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IVerifyEmailOtp {
  __typename: 'AuthPayLoad';
  token: string;
}

export const verifyEmailOtp = ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}): Promise<IVerifyEmailOtp> => {
  const query = gql`
    query VerifyEmailOtp($email: String!, $otp: String!) {
      verifyEmailOtp(email: $email, otp: $otp) {
        token
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { verifyEmailOtp },
        } = await client.query({
          query,
          variables: {
            email,
            otp,
          },
        });

        resolve(verifyEmailOtp);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
