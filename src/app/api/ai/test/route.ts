import { NextResponse } from 'next/server';
import Persona from '../../../../types/test/persona'
import ConversationEntry from '../../../../types/test/chat'
import { getMultiplePersonasByCoreId } from '../../../../db/queries';

export async function POST(req: Request) {
    
    const { jobDetails, screenshots, coreId } = await req.json();
    const personas: Persona[] = (await getMultiplePersonasByCoreId(coreId)) ?? [];
    let conversationHistory: ConversationEntry[] = []

    const results = await Promise.all(personas.map(async (persona) => {

        conversationHistory.push(
            { role: 'system', content: [{ type: 'text', text: persona.characteristic }] },
            { role: 'user', content: [{ type: 'text', text: `Job details: ${jobDetails}` }] },
        );

        let stepIndex = 0;
        const personaResults = [];

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

            personaResults.push(isCorrect ? 1 : 0);

            if (!isCorrect) {
                break;
            }

            stepIndex++;
        }

        return personaResults;
    }));

    return NextResponse.json({ results }, { status: 200 });
}
