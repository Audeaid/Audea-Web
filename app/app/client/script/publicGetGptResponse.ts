import openai, { IGPTResponse } from '@/utils/openai'

export function publicGetGptResponse(systemPrompt: string, userPrompt: string): Promise<IGPTResponse> {
  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data } = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo-16k',
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
        })

        resolve(data as unknown as IGPTResponse)
      } catch (error) {
        reject(error)
      }
    }

    fetchData()
  })
}
