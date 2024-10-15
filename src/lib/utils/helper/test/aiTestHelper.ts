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
    return (
        clickCoordinates.x >= x &&
        clickCoordinates.x <= x + (width ?? 0) &&
        clickCoordinates.y >= y &&
        clickCoordinates.y <= y + (height ?? 0)
    );
}

function validateClickedButton(clickCoordinates: Coordinates, screenData: NodeData) {
    for (const image of screenData.images) {
        for (const region of image.regions) {
            if (isWithinBounds(clickCoordinates, region.coordinates)) {
                return {
                    buttonId: image.id,
                    label: region.name,
                    leadsTo: region.leadsTo,
                    isCorrectPath: region.isCorrectPath,
                    isTheEnd: region.isTheEnd,
                };
            }
        }
    }

    return null;
}

export { extractActionReasonCoordinates, validateClickedButton };
