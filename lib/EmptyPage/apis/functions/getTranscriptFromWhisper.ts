import { IWhisperResponse } from '@/app/api/whisper/route';
import axios from 'axios';

export const getTranscriptFromWhisper = (
  file: File
): Promise<IWhisperResponse> => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axios.post('/api/whisper', formData);

        resolve(data as IWhisperResponse);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })();
  });
};
