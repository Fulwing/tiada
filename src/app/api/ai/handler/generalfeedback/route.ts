import { NextResponse } from 'next/server';
import { createUserbilityTestAgentExecutor } from '@/lib/langchain/agent/userbilityTest';

export async function POST(req: Request) {
    const { conversationHistory } = await req.json();

    try {
        const agentExecutor = await createUserbilityTestAgentExecutor();

        const response = await agentExecutor.invoke({
            input: "You are a usability tester. You are given a conversation history and you need to provide feedback on the usability of the testing.",
            chat_history: conversationHistory,
        });

        const feedback = response.output.trim();

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
