import { IWhisperResponse } from '@/app/api/whisper/route';
import axios from 'axios';

export const getTranscriptViaWhisperFromUrl = async (
  voiceNoteUrl: string
): Promise<IWhisperResponse> => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const url = new URL(voiceNoteUrl);
        const pathname = url.pathname;
        const fileKey = pathname.split('/').pop();

        if (!fileKey) throw new Error('filekey is null');

        const extension = fileKey.split('.').pop();

        if (!extension) throw new Error('extension is null');

        const audioFileResponse = await axios.get(url.href, {
          responseType: 'arraybuffer',
          timeout: 30000,
        });

        const model = 'whisper-1';

        const file = new File([audioFileResponse.data], `audio.${extension}`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', model);

        const response = await fetch(
          'https://api.openai.com/v1/audio/transcriptions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_SECRET}`,
            },
            body: formData,
          }
        );

        const whisperData: IWhisperResponse = await response.json();

        resolve(whisperData);
      } catch (error) {
        console.error(error);
        reject();
      }
    })();
  });
};
