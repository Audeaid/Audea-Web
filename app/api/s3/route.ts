import s3 from '$utils/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    const contentId = data.get('contentId') as string;

    if (!file) throw new Error('File is missing');
    if (!contentId) throw new Error('contentId is missing');

    const fileExtension = file.name.substring(file.name.lastIndexOf('.'));

    const fileParams = {
      Bucket: 'audea-voice-note',
      Key: `${contentId}${fileExtension}`,
      Expires: 600,
      ContentType: file.type,
      ACL: 'public-read',
    };

    const url = await s3.getSignedUrlPromise('putObject', fileParams);

    return NextResponse.json(url);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
