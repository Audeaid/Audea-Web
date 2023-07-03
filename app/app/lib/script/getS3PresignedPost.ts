import axios from 'axios';

export const getS3PresignedPost = (
  file: File,
  contentId: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('contentId', contentId);

        const { data }: { data: string } = await axios.post(
          '/api/s3',
          formData
        );

        resolve(data);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })();
  });
};
