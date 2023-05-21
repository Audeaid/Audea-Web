import s3 from '$utils/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    const contentId = data.get('contentId') as string;

    if (!file) throw new Error('File is missing');
    if (!contentId) throw new Error('contentId is missing');

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileExtension = file.name.substring(file.name.lastIndexOf('.'));

    const params = {
      Bucket: 'audea-voice-note',
      Key: `${contentId}${fileExtension}`,
      Body: buffer,
      ACL: 'public-read',
    };

    const upload = await s3.upload(params).promise();

    return NextResponse.json(upload);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
