import s3 from '@/utils/s3'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const contentId = data.get('contentId') as string
    const fileType = data.get('fileType') as string
    const fileExtension = data.get('fileExtension') as string

    if (!contentId) throw new Error('contentId is missing')
    if (!fileType) throw new Error('fileType is missing')
    if (!fileExtension) throw new Error('fileExtension is missing')

    const fileParams = {
      Bucket: 'audea-us',
      Key: `${contentId}${fileExtension}`,
      Expires: 600,
      ContentType: fileType,
      //   ACL: 'public-read',
    }

    const url = await s3.getSignedUrlPromise('putObject', fileParams)

    return NextResponse.json(url)
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
