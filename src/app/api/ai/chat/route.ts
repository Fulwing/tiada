import { NextResponse } from 'next/server';
import { getPersonaChatById, updatePersonaChatById } from '../../../../db/queries';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const { personaId, userText } = await req.json();

    try {
        const personaChat = await getPersonaChatById(personaId);
        let conversationHistory;

        if (!personaChat) {
            return NextResponse.json({ message: 'Persona Chat not found' }, { status: 404 });
        }

         conversationHistory = personaChat.chatHistory as OpenAI.Chat.Completions.ChatCompletionMessageParam[];

        conversationHistory.push({
            role: 'user',
            content: [
                { type: 'text', text: userText },
            ],
        });

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: conversationHistory,
        });

        const personaText = response.choices?.[0]?.message?.content?.trim();

        conversationHistory.push({
            role: 'assistant',
            content: personaText
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