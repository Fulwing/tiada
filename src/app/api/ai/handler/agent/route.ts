import { NextResponse } from 'next/server';
import { getNodeById } from '../../../../../db/queries';
import { createAgent } from '@/lib/langchain/chatBot/agent';

export async function POST(req: Request) {
    const { predictedAction, screenshotId } = await req.json();

    try {
        const node = await getNodeById(screenshotId);
        if (!node) {
            return NextResponse.json({ message: 'Node not found' }, { status: 404 });
        }

        const prompt = `Validate if the predicted action "${predictedAction}" is correct based on the marked touchpoints in the following UI screenshot. Answer starts with Yes or No and a explain.`;

        const model = await createAgent();

        const messages = [
            { role: 'system', content: 'You are an assistant that validates UI actions.' },
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    { type: 'image_url', image_url: { url: `data:image/png;base64,${node.markedPicture.toString('base64')}` } },
                ],
            },
        ]

        const response = await model.invoke(messages);

        const isCorrect = response.content.toString().toLocaleLowerCase().startsWith('y');

        return NextResponse.json({ isCorrect }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
