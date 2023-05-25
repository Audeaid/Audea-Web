import { IGPTResponse } from '@/app/api/gpt/route';
import axios from 'axios';

export const getGptResponse = (
  systemPrompt: string,
  userPrompt: string
): Promise<IGPTResponse> => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const formData = new FormData();
        formData.append('systemPrompt', systemPrompt);
        formData.append('userPrompt', userPrompt);

        const { data } = await axios.post('/api/gpt', formData);

        resolve(data as IGPTResponse);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })();
  });
};
