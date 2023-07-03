import axios from 'axios';

export const getS3PresignedPost = (
  contentId: string,
  fileType: string,
  fileExtension: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const formData = new FormData();
        formData.append('contentId', contentId);
        formData.append('fileType', fileType);
        formData.append('fileExtension', fileExtension);

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
