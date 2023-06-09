import client from '@/utils/graphql';
import { gql } from '@apollo/client';

export interface IGetAllContent {
  [key: string]: any;
  __typename: 'Content';
  id: string;
  createdAt: string;
  title: string | null;
  voiceNoteUrl: string | null;
  transcript: string | null;
  gptGenerated: string | null;
  typeOfPromptId: string | null;
  userId: string;
  writingStyle: string | null;
  outputLanguage: string | null;
}

export const getAllContent = (
  token: string
): Promise<IGetAllContent[] | null> => {
  const query = gql`
    query GetAllContent {
      getAllContent {
        id
        createdAt
        title
        voiceNoteUrl
        transcript
        gptGenerated
        typeOfPromptId
        userId
        writingStyle
        outputLanguage
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getAllContent },
        } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getAllContent);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
