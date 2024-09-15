import { NextResponse } from 'next/server';
import { getNodeById } from '../../../../../db/queries';
import { createPersonaTestAgent } from '@/lib/langchain/chatBot/personaTest';
import { extractActionReason } from '@/lib/utils/helper/test/aiTestHelper';

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
                { type: 'text', text: 'Analyze the following UI screenshot and determine the action to take based on the image. Reply in this format. Action: [what action you where taking] | Reason: [ why did you take this action] seperate those two by |' },
                { type: 'image_url', image_url: { url: `data:image/png;base64,${node.picture.toString('base64')}` } },
            ],
        });

        const model = await createPersonaTestAgent(0);

        const response = await model.invoke(conversationHistory);

        const personaText = response.content.toString();

        const { action, reason } = extractActionReason(personaText);

        conversationHistory.push({
            role: 'assistant',
            content: [
                { type: 'text', text: personaText }
            ]
        });

        return NextResponse.json({ action, reason, personaText, conversationHistory }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
        }
    }
}