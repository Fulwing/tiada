import { NextResponse } from 'next/server';
import { getNodeById } from '../../../../../db/queries';
import OpenAI from 'openai';

export const config = {
    maxDuration: 300, //sec
};

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
                { type: 'text', text: 'Analyze the following UI screenshot and determine the action to take based on the image. Reply in this format. Action: [what action you where taking] | Reason: [ why did you take this action] seperate those two by |' },
                { type: 'image_url', image_url: { url: `data:image/png;base64,${node.picture.toString('base64')}` } },
            ],
        });

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: conversationHistory,
        });

        const personaText = response.choices?.[0]?.message?.content?.trim();
        let action, reason;

        console.log("personaText", personaText);

        if (personaText) {
            const actionStart = personaText.indexOf("Action: ");
            const reasonStart = personaText.indexOf("Reason: ");

            if (actionStart !== -1 && reasonStart !== -1) {
                action = personaText.substring(actionStart + 8, reasonStart - 2).trim();
                reason = personaText.substring(reasonStart + 8).trim();
            } else {
                console.error("The input string does not contain both 'Action:' and 'Reason:'.");
            }
        } else {
            console.error("'input' is undefined.");
        }

        conversationHistory.push({
            role: 'assistant',
            content: [
                { type: 'text', text: personaText }
            ]
        });

        console.log("everything is ok")
        return NextResponse.json({ action, reason, personaText, conversationHistory }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
        }
    }
}