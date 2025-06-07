import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful customer service representative for Motion Design Club, an online platform for motion design courses. 
          You should be friendly, professional, and knowledgeable about our courses and services.
          Key information about our platform:
          - We offer motion design courses ranging from $49 to $199
          - Courses duration: 4-12 weeks
          - We provide certificates upon completion
          - 30-day money-back guarantee
          - 24/7 support available
          - Basic computer skills required for most courses
          - Advanced courses may require prior design software experience`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}
