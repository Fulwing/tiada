import { NextResponse } from 'next/server';
import { getNodeById } from '../../../../../db/queries';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const { conversationHistory } = await req.json();

    try {
        const prompt = `Based on user's performance give a general feedback of what should be improved on the product.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: conversationHistory },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt }
                    ],
                },
            ],
        });

        const feedback = response.choices?.[0]?.message?.content?.trim();

        return NextResponse.json({ feedback }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
