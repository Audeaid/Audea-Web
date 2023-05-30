import client from '$utils/graphql';
import { gql } from '@apollo/client';

interface IUpdateContent {
  __typename: 'Content';
  id: string;
}

export const updateContent = ({
  token,
  contentId,
  title,
  transcript,
  gptGenerated,
}: {
  token: string;
  contentId: string;
  transcript?: string;
  title?: string;
  gptGenerated?: string;
}): Promise<IUpdateContent> => {
  const mutation = gql`
    mutation UpdateContent(
      $contentId: String!
      $transcript: String
      $gptGenerated: String
      $title: String
    ) {
      updateContent(
        contentId: $contentId
        transcript: $transcript
        gptGenerated: $gptGenerated
        title: $title
      ) {
        id
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { updateContent },
        } = await client.mutate({
          mutation,
          variables: {
            contentId,
            title: title ?? null,
            transcript: transcript ?? null,
            gptGenerated: gptGenerated ?? null,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        resolve(updateContent);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
