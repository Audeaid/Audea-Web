import axios from 'axios'

export function downloadAudioFileFromS3(s3ObjectName: string): Promise<File> {
  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data: urlGetObject }: { data: string } = await axios.post('/api/s3/getObject', {
          s3ObjectName,
        })

        const url = new URL(urlGetObject)

        const audioFileResponse = await axios.get(url.href, {
          responseType: 'arraybuffer',
          timeout: Infinity,
        })

        const file = new File([audioFileResponse.data], s3ObjectName, { type: 'audio/mpeg' })

        resolve(file)
      } catch (error) {
        reject(error)
      }
    }

    fetchData()
  })
}
