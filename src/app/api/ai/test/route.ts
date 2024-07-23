import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    try {
        // Get predicted button from persona AI
        const personaResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/persona-ai?id=${id}`);
        const { predictedButton } = await personaResponse.json();

        // Validate predicted button with agent AI
        const agentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agent-ai?id=${id}&predictedButton=${predictedButton}`);
        const { isCorrect } = await agentResponse.json();

        return NextResponse.json({ isCorrect }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
        }
    }
}