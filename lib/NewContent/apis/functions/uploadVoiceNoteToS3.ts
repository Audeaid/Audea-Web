import { ManagedUpload } from 'aws-sdk/clients/s3';
import axios from 'axios';

export const uploadVoiceNoteToS3 = (
  file: File,
  contentId: string
): Promise<ManagedUpload.SendData> => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('contentId', contentId);

        const { data } = await axios.post('/api/s3', formData);

        resolve(data as ManagedUpload.SendData);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })();
  });
};
