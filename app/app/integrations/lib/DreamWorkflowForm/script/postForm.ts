import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IPostForm {
  __typename: 'ResponseMessage';
  response: string;
}

export const postForm = (
  token: string,
  longText: string
): Promise<IPostForm> => {
  const mutation = gql`
    mutation DreamWorkflowForm($longText: String!) {
      dreamWorkflowForm(longText: $longText) {
        response
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { dreamWorkflowForm },
        } = await client.mutate({
          mutation,
          variables: {
            longText,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(dreamWorkflowForm);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
