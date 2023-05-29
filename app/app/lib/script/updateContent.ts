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
  writingStyle,
  outputLanguage,
}: {
  token: string;
  contentId: string;
  title: string | null;
  voiceNoteUrl: string | null;
  transcript: string | null;
  gptGenerated: string | null;
  typeOfPromptId: string | null;
  writingStyle: string | null;
  outputLanguage: string | null;
}): Promise<IUpdateContent> => {
  const mutation = gql`
    mutation UpdateContent(
      $contentId: String!
      $title: String
      $voiceNoteUrl: String
      $transcript: String
      $gptGenerated: String
      $typeOfPromptId: String
      $writingStyle: String
      $outputLanguage: OutputLanguageEnum
    ) {
      updateContent(
        contentId: $contentId
        title: $title
        voiceNoteUrl: $voiceNoteUrl
        transcript: $transcript
        gptGenerated: $gptGenerated
        typeOfPromptId: $typeOfPromptId
        writingStyle: $writingStyle
        outputLanguage: $outputLanguage
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
            writingStyle,
            outputLanguage,
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
