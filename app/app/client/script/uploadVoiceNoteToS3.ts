import axios from 'axios'

export const uploadVoiceNoteToS3 = (file: File, url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const formData = new FormData()
        formData.append('file', file)

        await axios.put(url, formData, {
          headers: {
            'Content-Type': file.type,
          },
        })

        const location = url.split('?')[0]

        if (!location) throw new Error('Invalid generated URL.')

        resolve(location)
      } catch (error) {
        reject(error)
      }
    }

    fetchData()
  })
}
