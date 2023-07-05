import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetNotionTitleName {
  __typename: 'ResponseMessage';
  response: string;
}

export const getNotionTitleName = (
  token: string
): Promise<IGetNotionTitleName> => {
  const query = gql`
    query GetNotionTitleName {
      getNotionTitleName {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getNotionTitleName },
        } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getNotionTitleName);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
