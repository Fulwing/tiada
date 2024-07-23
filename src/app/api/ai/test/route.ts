import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { jobDetails, screenshots } = await req.json();
    const results = [];
    let stepIndex = 0;
    let conversationHistory = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Job details: ${jobDetails}` },
    ];

    while (stepIndex < screenshots.length) {
        // Send screenshot to persona AI
        const personaResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/handler/persona`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversationHistory,
                screenshotId: screenshots[stepIndex],
            }),
        });

        if (!personaResponse.ok) {
            throw new Error('Failed to fetch data from Persona AI');
        }

        const { action, conversationHistory: newConversationHistory } = await personaResponse.json();
        conversationHistory = newConversationHistory;

        // Validate action with agent AI
        const agentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/handler/agent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                predictedAction: action,
                screenshotId: screenshots[stepIndex],
            }),
        });

        if (!agentResponse.ok) {
            throw new Error('Failed to fetch data from Agent AI');
        }

        const { isCorrect } = await agentResponse.json();

        results.push(isCorrect ? 1 : 0);

        if (!isCorrect) {
            break;
        }

        stepIndex++;
    }

    return NextResponse.json({ results, conversationHistory }, { status: 200 });
}
