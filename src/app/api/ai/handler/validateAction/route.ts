import getMockData from '@/db/mock/appScreens';
import { Coordinates } from '@/types/node/node';
import { validateClickedButton } from '@/lib/utils/helper/test/aiTestHelper';

export async function validateAction(coordinates: Coordinates, currentScreen: string): Promise<{ leadsTo: string; isCorrectPath: boolean }> {
    try {
        const mockData = getMockData();

        const clickedButton = validateClickedButton(coordinates, mockData);
        
        if (!clickedButton) {
            console.log('No matching button found');
            // TODO: click on the wrong part without path specified, ask persona to click again. on the same page.
            throw new Error('No matching button found');
        }

        return {
            leadsTo: clickedButton.leadsTo,
            isCorrectPath: clickedButton.isCorrectPath
        };
    } catch (error) {
        console.error('Error validating action:', error);
        throw error;
    }
}
