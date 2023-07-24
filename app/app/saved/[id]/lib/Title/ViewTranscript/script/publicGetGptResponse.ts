import openai, { IGPTResponse } from '@/utils/openai'

export const publicGetGptResponse = (systemPrompt: string, userPrompt: string): Promise<IGPTResponse> => {
  return new Promise((resolve, reject) => {
    const fetchData = async () => {
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
        })

        resolve(data as unknown as IGPTResponse)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    }

    fetchData()
  })
}
