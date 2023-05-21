import openai from '$utils/openai';
import { NextRequest, NextResponse } from 'next/server';

export interface IGPTResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    const systemPrompt = data.get('systemPrompt');
    const userPrompt = data.get('userPrompt');

    if (!systemPrompt) throw new Error('systemPrompt is missing');
    if (!userPrompt) throw new Error('userPrompt is missing');

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: systemPrompt.toString(),
        },
        {
          role: 'user',
          content: userPrompt.toString(),
        },
      ],
    });

    return NextResponse.json(completion.data);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
