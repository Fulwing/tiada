import { NextResponse } from 'next/server';
import Persona from '../../../../types/test/persona'
import { Step } from '../../../../types/test/result'
import { InsertResult } from '../../../../db/schema'
import ConversationEntry from '../../../../types/test/chat'
import { getMultiplePersonasByCoreId, addMultipleResults, addPersonaChat} from '../../../../db/queries';

export async function POST(req: Request) {

    const { jobDetails, screenshots, userId: coreId } = await req.json();
    const personas: Persona[] = (await getMultiplePersonasByCoreId(coreId)) ?? [];
    let testResults: InsertResult[] = [];
    let conversationHistory: ConversationEntry[] = []

    const results = await Promise.all(personas.map(async (persona) => {

        // Initialize testResult as a new object
        let testResult: InsertResult = {
            personaId: persona.id ?? "nullPersonaId",
            taskCompletion: 'Success',
            coreId: coreId,
            completionTime: 0,
            generalFeedback: '',
            steps: 0,
            stepObj: []
        };

        // data initialize
        conversationHistory.push(
            { role: 'system', content: [{ type: 'text', text: persona.characteristic }] },
            { role: 'user', content: [{ type: 'text', text: `Job details: ${jobDetails}` }] },
        );

        let stepIndex = 0;
        const personaResults = [];

        // result prepare
        const startTime = new Date().getTime();
        let stages: Step[] = [];

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

            const { action, reason, conversationHistory: newConversationHistory, personaText } = await personaResponse.json();
            conversationHistory = newConversationHistory;

            // Validate action with agent AI
            const agentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/handler/agent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    predictedAction: personaText,
                    screenshotId: screenshots[stepIndex],
                }),
            });

            if (!agentResponse.ok) {
                throw new Error('Failed to fetch data from Agent AI');
            }

            const { isCorrect } = await agentResponse.json();

            personaResults.push(isCorrect ? 1 : 0);

            if (!isCorrect) {
                testResult.taskCompletion = 'Failed'
                break;
            }

            stepIndex++;

            // conclude data for Step
            stages.push({
                stepNumber: stepIndex,
                status: isCorrect ? 'success' : 'miss',
                description: isCorrect ? 'doing correct' : 'missed the button',
                image: `${screenshots[stepIndex]}`,
                userAction: action,
                userExplanation: reason,
            });
        }

        const general_feedback = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/handler/generalfeedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversationHistory
            }),
        });

        // result conclude
        const endTime = new Date().getTime();
        testResult.completionTime = (endTime - startTime) / 1000; //sec
        testResult.generalFeedback = await general_feedback.json();
        testResult.steps = stepIndex;
        testResult.stepObj = stages;

        // add chat history 
        await addPersonaChat({
            personaId: persona.id ?? "nullPersonaId",
            chatHistory: conversationHistory,
        })

        testResults.push(testResult);

        return personaResults;
    }));

    await addMultipleResults(testResults);

    return NextResponse.json({ results }, { status: 200 });
}
