import { Coordinates, NodeData } from "@/types/node/node";

const extractActionReasonCoordinates = (personaText: string) => {
    let action = '';
    let reason = '';
    let coordinates: Coordinates = { x: 0, y: 0 };

    if (personaText) {
        console.log(personaText);
        const actionStart = personaText.indexOf("Action: ");
        const reasonStart = personaText.indexOf("Reason: ");
        const coordinatesStart = personaText.indexOf("Coordinates: ");

        if (actionStart !== -1 && reasonStart !== -1 && coordinatesStart !== -1) {
            action = personaText.substring(actionStart + 8, reasonStart - 2).trim();
            reason = personaText.substring(reasonStart + 8, coordinatesStart - 2).trim();
            
            // Extract the coordinates in the form of "Coordinates: [x, y]"
            const coordinatesText = personaText.substring(coordinatesStart + 12).trim();
            const coordArray = coordinatesText.replace(/[\[\]]/g, '').split(',').map(Number);

            if (coordArray.length === 2) {
                coordinates = { x: coordArray[0], y: coordArray[1] };
            } else {
                console.error("Invalid coordinates format");
            }

        } else {
            console.error("The input string does not contain Action, Reason, and/or Coordinates");
        }
    } else {
        console.error("Input is undefined");
    }

    return { action, reason, coordinates };
}

function isWithinBounds(clickCoordinates: Coordinates, buttonCoordinates: Coordinates) {
    const { x, y, width, height } = buttonCoordinates;
    
    // Check if the click is within the button's rectangular area
    return (
      clickCoordinates.x >= x &&
      clickCoordinates.x <= x + (width ?? 0) &&
      clickCoordinates.y >= y &&
      clickCoordinates.y <= y + (height ?? 0)
    );
  }

  function validateClickedButton(
    clickCoordinates: Coordinates, 
    screenData: NodeData
  ): { 
    buttonId: string; 
    label: string; 
    leadsTo: string; 
    isCorrectPath: boolean; 
    isTheEnd: boolean; 
  } | null {
    // Loop through each screen
    for (const screen of screenData.screens) {
      // Loop through each annotation (button) on the screen
      for (const annotation of screen.annotations) {
        // Check if the click coordinates fall within the bounds of this button
        if (isWithinBounds(clickCoordinates, annotation.coordinates)) {
          return {
            buttonId: annotation.id,
            label: annotation.label,
            leadsTo: annotation.leadsTo,
            isCorrectPath: annotation.isCorrectPath,
            isTheEnd: annotation.isTheEnd,
          };
        }
      }
    }
  
    // Return null if no button was clicked
    return null;
  }

export { extractActionReasonCoordinates, validateClickedButton };
