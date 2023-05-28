import { IGPTResponse } from '@/app/api/gpt/route';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_SECRET as string,
});

const openai = new OpenAIApi(configuration);

export const publicGetGptResponse = (
  systemPrompt: string,
  userPrompt: string
): Promise<IGPTResponse> => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { data } = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo-0301',
          max_tokens: 2048,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        });

        resolve(data as unknown as IGPTResponse);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })();
  });
};
