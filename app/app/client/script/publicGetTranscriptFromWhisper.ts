import { IWhisperResponse } from '@/app/api/whisper/route'

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
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_SECRET}`,
          },
          body: formData,
        })

        const whisperData: IWhisperResponse = await response.json()

        resolve(whisperData)
      } catch (error) {
        reject(error)
      }
    }

    fetchData()
  })
}
