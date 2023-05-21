import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IGetOneContent {
  __typename: 'Content';
  id: string;
  title: string | null;
  createdAt: string;
  gptGenerated: string | null;
  transcript: string | null;
  typeOfPromptId: string | null;
  voiceNoteUrl: string | null;
}

export const getOneContent = (
  token: string,
  contentId: string
): Promise<IGetOneContent> => {
  const query = gql`
    query GetOneContent($contentId: String!) {
      getOneContent(contentId: $contentId) {
        id
        title
        transcript
        typeOfPromptId
        voiceNoteUrl
        gptGenerated
        createdAt
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getOneContent },
        } = await client.query({
          query,
          variables: {
            contentId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getOneContent);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
