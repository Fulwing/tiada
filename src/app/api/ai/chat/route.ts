import { NextResponse } from 'next/server';
import { getPersonaChatById, updatePersonaChatById } from '../../../../db/queries';
import { createPersonaChatAgent } from '@/lib/langchain/chatBot/personaChat';

export async function POST(req: Request) {
    const { personaId, userText } = await req.json();

    try {
        const personaChat = await getPersonaChatById(personaId);

        if (!personaChat) {
            return NextResponse.json({ message: 'Persona Chat not found' }, { status: 404 });
        }

        let conversationHistory: any = personaChat.chatHistory;
        conversationHistory.push({
            role: 'user',
            content: [
                { type: 'text', text: userText }
            ],
        });

        const model = await createPersonaChatAgent(0);

        const response = await model.invoke(conversationHistory);

        const personaText = response.content.toString();

        conversationHistory.push({
            role: 'assistant',
            content: [
                { type: 'text', text: personaText }
            ]
        });

        await updatePersonaChatById(personaId, {
            chatHistory: conversationHistory
        });

        return NextResponse.json({ personaText }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
        }
    }
}