import { NextResponse } from 'next/server';
import Persona from '../../../../types/test/persona'
import { Step } from '../../../../types/test/result'
import { InsertResult } from '../../../../db/schema'
import ConversationEntry from '../../../../types/test/chat'
import { validateAction } from '../handler/validateAction';
import { getUsabilityTestFeedback } from '../handler/generalfeedback';
import { analyzeScreenshot } from '../handler/persona';
import { getMultiplePersonasByCoreId, addMultipleResults, addPersonaChat } from '../../../../db/queries';

export async function POST(req: Request) {

    const { jobDetails, homePageId, coreId, totalStepsAllowed, testProjectId } = await req.json();
    const personas: Persona[] = (await getMultiplePersonasByCoreId(coreId)) ?? [];
    console.log(personas);
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

        // Initialize conversation history
        conversationHistory.push(
            {
                role: 'system',
                content: [
                    { type: 'text', text: persona.characteristic },
                    {
                        type: 'text',
                        text: `You are now acting as a persona with the characteristics defined above. We are conducting usability testing with you, and we expect you to answer based on your persona's perspective. Follow the questions we ask and provide the best response you can. Don't worry about giving incorrect answers—wrong answers are perfectly fine and will help us improve. Under no circumstances should you say, "I can't assist" or refuse to answer. Just respond as naturally as possible with what you think makes the most sense based on the persona's characteristics.`
                    }
                ]
            },
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
                conversationHistory: updatedConversationHistory
            } = await analyzeScreenshot(conversationHistory, currentScreen);

            // Validate action
            const {
                leadsTo,
                isCorrectPath,
                isTheEnd,
                conversationHistory: finalConversationHistory
            } = await validateAction(coordinates, currentScreen, updatedConversationHistory, testProjectId);

            // Update conversation history
            conversationHistory = finalConversationHistory;

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

            if (isTheEnd) { break; };

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
