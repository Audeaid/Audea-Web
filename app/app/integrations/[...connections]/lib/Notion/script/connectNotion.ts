import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IConnectNotion {
  __typename: 'NotionAccount';
  workspaceName: string;
  workspaceIcon: string | null;
}

export const connectNotion = (
  token: string,
  notionCode: string
): Promise<IConnectNotion> => {
  const mutation = gql`
    mutation ConnectNotionAccount($notionCode: String!) {
      connectNotionAccount(notionCode: $notionCode) {
        workspaceName
        workspaceIcon
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { connectNotionAccount },
        } = await client.mutate({
          mutation,
          variables: {
            notionCode,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(connectNotionAccount);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
