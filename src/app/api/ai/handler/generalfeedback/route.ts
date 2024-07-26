import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const { conversationHistory } = await req.json();

    try {
        const prompt = `Based on user's performance give a general feedback of what should be improved on the product. Reply me with a title: To improve user performance with the product, consider the following feedback: and list in 1 2 3...`;

        conversationHistory.push({
            role: 'user',
            content: [
                { type: 'text', text: prompt }
            ],
        });

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: conversationHistory
        });

        const feedback = response.choices?.[0]?.message?.content?.trim();

        return NextResponse.json({ feedback }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
