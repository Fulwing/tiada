import { getNodeById } from '../../../../../db/queries';
import { createPersonaTestAgent } from '@/lib/langchain/chatBot/personaTest';
import { extractActionReasonCoordinates } from '@/lib/utils/helper/test/aiTestHelper';
import { Coordinates } from '@/types/node/node';
import ConversationEntry from '@/types/test/chat'

export async function analyzeScreenshot(conversationHistory: any[], screenshotId: string): Promise<{
    action: string;
    reason: string;
    coordinates: Coordinates;
    conversationHistory: ConversationEntry[];
}> {
    try {
        const node = await getNodeById(screenshotId);
        if (!node) {
            throw new Error('Node not found');
        }

        conversationHistory.push({
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: 'Analyze the following UI screenshot and determine the action to take based on the image. Reply in this format: Action: [what action you were taking] | Reason: [why did you take this action] | Coordinates: [x, y]. Separate each part by a |. The coordinates should be the pixel point on the image where you intend to click.'
                },
                {
                    type: 'image_url',
                    image_url: {
                        url: `data:image/png;base64,${node.picture.toString('base64')}`
                    }
                },
            ],
        });

        const model = await createPersonaTestAgent(0);

        const response = await model.invoke(conversationHistory);

        const personaText = response.content.toString();

        const { action, reason, coordinates } = extractActionReasonCoordinates(personaText);

        conversationHistory.push({
            role: 'assistant',
            content: [
                { type: 'text', text: personaText }
            ]
        });

        return { action, reason, coordinates, conversationHistory };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}
