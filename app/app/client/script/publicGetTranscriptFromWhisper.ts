import { PUBLIC_OPEN_AI_SECRET } from '@/utils/constant'
import { IWhisperResponse } from '@/utils/openai'

export function publicGetTranscriptFromWhisper(file: File): Promise<IWhisperResponse> {
  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const model = 'whisper-1'

        const formData = new FormData()
        formData.append('file', file)
        formData.append('model', model)

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${PUBLIC_OPEN_AI_SECRET}`,
          },
          body: formData,
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whisperData: any = await response.json()

        if ('error' in whisperData) {
          reject(whisperData)
        } else {
          const data = whisperData as IWhisperResponse
          resolve(data)
        }

        resolve(whisperData)
      } catch (error) {
        reject(error)
      }
    }

    fetchData()
  })
}
