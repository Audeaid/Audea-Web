export const uploadVoiceNoteToS3 = (file: File, url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        })

        const location = url.split('?')[0].split('/')[3]

        if (!location) throw new Error('Invalid generated URL.')

        resolve(location)
      } catch (error) {
        reject(error)
      }
    }

    fetchData()
  })
}
