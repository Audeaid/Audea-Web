import client from '$utils/graphql';
import { gql } from '@apollo/client';

export interface IUpdateContent {
  __typename: 'Content';
  id: string;
}

export const updateContent = ({
  token,
  contentId,
  title,
  voiceNoteUrl,
  transcript,
  gptGenerated,
  typeOfPromptId,
}: {
  token: string;
  contentId: string;
  title: string;
  voiceNoteUrl: string;
  transcript: string;
  gptGenerated: string;
  typeOfPromptId: string;
}): Promise<IUpdateContent> => {
  const mutation = gql`
    mutation UpdateContent(
      $contentId: String!
      $title: String
      $voiceNoteUrl: String
      $transcript: String
      $gptGenerated: String
      $typeOfPromptId: String
    ) {
      updateContent(
        contentId: $contentId
        title: $title
        voiceNoteUrl: $voiceNoteUrl
        transcript: $transcript
        gptGenerated: $gptGenerated
        typeOfPromptId: $typeOfPromptId
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
            title,
            voiceNoteUrl,
            transcript,
            gptGenerated,
            typeOfPromptId,
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
