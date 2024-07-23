import { NextRequest, NextResponse } from 'next/server';
import { getNodeById } from '../../../../../db/queries';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const { predictedAction, screenshotId } = await req.json();

    try {
        const node = await getNodeById(screenshotId);
        if (!node) {
            return NextResponse.json({ message: 'Node not found' }, { status: 404 });
        }

        const prompt = `Validate if the predicted action "${predictedAction}" is correct based on the marked touchpoints in the following UI screenshot. Answer start with Yes or No and a explain.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: 'You are an assistant that validates UI actions.' },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        { type: 'image_url', image_url: { url: `data:image/png;base64,${node.markedPicture.toString('base64')}` } },
                    ],
                },
            ],
        });

        const isCorrect = response.choices?.[0]?.message?.content?.trim().toLocaleLowerCase().startsWith('y');

        return NextResponse.json({ isCorrect }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
