import { NextRequest, NextResponse } from 'next/server';

export interface IWhisperResponse {
  text: string;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;

    if (!file) throw new Error('File is missing');

    const model = 'whisper-1';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', model);

    const response = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_SECRET}`,
        },
        body: formData,
      }
    );

    const whisperData: IWhisperResponse = await response.json();

    return NextResponse.json(whisperData);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
