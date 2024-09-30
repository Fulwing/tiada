import { NextResponse } from 'next/server';
import Persona from '../../../../types/test/persona'
import { Step } from '../../../../types/test/result'
import { InsertResult } from '../../../../db/schema'
import ConversationEntry from '../../../../types/test/chat'
import { validateAction } from '../handler/validateAction/route';
import { getUsabilityTestFeedback } from '../handler/generalfeedback/route';
import { analyzeScreenshot } from '../handler/persona/route';
import { getMultiplePersonasByCoreId, addMultipleResults, addPersonaChat } from '../../../../db/queries';

export async function POST(req: Request) {

    const { jobDetails, homePageId, userId: coreId, totalStepsAllowed } = await req.json();
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

        conversationHistory.push(
            { role: 'system', content: [{ type: 'text', text: persona.characteristic }] },
            { role: 'user', content: [{ type: 'text', text: `Job details: ${jobDetails}` }] },
        );

        let stepIndex: number = 0;
        let currentScreen: string = homePageId;
        const personaResults: number[] = [];

        // result prepare
        const startTime: number = new Date().getTime();
        let stages: Step[] = [];

        while (stepIndex < totalStepsAllowed) {
            // Send screenshot to persona AI
            const {
                action,
                reason,
                coordinates,
                conversationHistory: newConversationHistory
            } = await analyzeScreenshot(conversationHistory, currentScreen);

            // Update conversation history
            conversationHistory = newConversationHistory;

            // Validate action
            const { leadsTo, isCorrectPath } = await validateAction(coordinates, currentScreen);

            personaResults.push(isCorrectPath ? 1 : 0);

            stepIndex++;

            // conclude data for Step
            stages.push({
                stepNumber: stepIndex,
                status: isCorrectPath ? 'success' : 'miss',
                description: isCorrectPath ? 'doing correct' : 'missed the button',
                image: currentScreen,
                userAction: action,
                userExplanation: reason,
            });

            currentScreen = leadsTo;

        }

        // get general feedback
        const general_feedback = await getUsabilityTestFeedback(conversationHistory);

        // result conclude
        const endTime: number = new Date().getTime();
        testResult.completionTime = endTime - startTime;
        testResult.generalFeedback = general_feedback;
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
