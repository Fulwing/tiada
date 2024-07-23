import { NextRequest, NextResponse } from 'next/server';
import { getNodeById } from '../../../../../db/queries';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const { conversationHistory, screenshotId } = await req.json();

    try {
        const node = await getNodeById(screenshotId);
        if (!node) {
            return NextResponse.json({ message: 'Node not found' }, { status: 404 });
        }

        conversationHistory.push({
            role: 'user',
            content: [
                { type: 'text', text: 'Analyze the following UI screenshot and determine the action to take based on the image.' },
                { type: 'image_url', image_url: { url: `data:image/png;base64,${node.picture.toString('base64')}` } },
            ],
        });

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: conversationHistory,
        });

        const action = response.choices?.[0]?.message?.content?.trim();

        if (!action) {
            throw new Error('No action received from OpenAI');
        }

        conversationHistory.push({
            role: 'assistant',
            content: action,
        });

        return NextResponse.json({ action, conversationHistory }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
        }
    }
}