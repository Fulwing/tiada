import { getAnnotationsByTestProjectId } from '@/db/queries/annotations';
import { Coordinates, NodeData } from '@/types/node/node';
import { validateClickedButton } from '@/lib/utils/helper/test/aiTestHelper';
import ConversationEntry from '@/types/test/chat';

export async function validateAction(
  coordinates: Coordinates, 
  currentScreen: string, 
  conversationHistory: ConversationEntry[], 
  testProjectId: string
): Promise<{ 
  leadsTo: string; 
  isCorrectPath: boolean; 
  isTheEnd: boolean; 
  conversationHistory: ConversationEntry[]; 
}> {
  try {
    const screenData = await getAnnotationsByTestProjectId(testProjectId);
    const filteredScreenData = screenData.screens.find(screen => screen.id === currentScreen);
    let clickedButton;

    if (filteredScreenData) {
      const nodeDataForValidation: NodeData = {
        screens: [filteredScreenData]
      };
      clickedButton = validateClickedButton(coordinates, nodeDataForValidation);
    } else {
      throw new Error(`Screen data not found for screen ID: ${currentScreen}`);
    }

    if (!clickedButton) {
      conversationHistory.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'The action you made is outside the test range. Please make a new action.',
          },
        ],
      });

      return {
        leadsTo: currentScreen,
        isCorrectPath: false,
        isTheEnd: false,
        conversationHistory,
      };
    }

    const { leadsTo, isCorrectPath, isTheEnd } = clickedButton;

    return {
      leadsTo,
      isCorrectPath,
      isTheEnd,
      conversationHistory,
    };
  } catch (error) {
    console.error('Validation failed:', error);
    if (error instanceof Error) {
      throw new Error('Validation failed: ' + error.message);
    } else {
      throw new Error('Validation failed: An unknown error occurred');
    }
  }
}
