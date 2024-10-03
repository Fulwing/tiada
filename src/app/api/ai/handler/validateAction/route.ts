import getMockData from '@/db/mock/appScreens';
import { Coordinates } from '@/types/node/node';
import { validateClickedButton } from '@/lib/utils/helper/test/aiTestHelper';
import ConversationEntry from '@/types/test/chat'

export async function validateAction(coordinates: Coordinates, currentScreen: string, conversationHistory: any[]): Promise<{ 
    leadsTo: string; 
    isCorrectPath: boolean; 
    conversationHistory: ConversationEntry[]; 
}> {
    try {
        const mockData = getMockData();
        const clickedButton = validateClickedButton(coordinates, mockData);

        // If no valid button is found, return current screen and incorrect path
        if (!clickedButton) {

            conversationHistory.push({
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'The action you made is outside the test range. Please make a new action.'
                    },
                ],
            });

            return {
                leadsTo: currentScreen,
                isCorrectPath: false,
                conversationHistory
            };
        }

        const { leadsTo, isCorrectPath } = clickedButton;

        return {
            leadsTo,
            isCorrectPath,
            conversationHistory
        };

    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Validation failed: ' + error.message);
        } else {
            throw new Error('Validation failed due to an unknown error.');
        }
    }
}
