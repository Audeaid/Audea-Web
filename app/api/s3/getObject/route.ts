import s3 from '@/utils/s3'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const s3ObjectName: string | null | undefined = data.s3ObjectName

    if (!s3ObjectName) throw new Error('s3ObjectName is missing')

    const fileParams = {
      Bucket: 'audea-us',
      Key: s3ObjectName,
      Expires: 1000,
    }

    const url = await s3.getSignedUrlPromise('getObject', fileParams)

    return NextResponse.json(url)
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
