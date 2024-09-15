const extractActionReason = (personaText: string) => {
    let action, reason;

    if (personaText) {
        const actionStart = personaText.indexOf("Action: ");
        const reasonStart = personaText.indexOf("Reason: ");

        if (actionStart !== -1 && reasonStart !== -1) {
            action = personaText.substring(actionStart + 8, reasonStart - 2).trim();
            reason = personaText.substring(reasonStart + 8).trim();
        } else {
            console.error("The input string does not contain both Action and Reason");
        }
    } else {
        action = "";
        reason = "";
        console.error("input is undefined");
    }

    return { action, reason };
}

export { extractActionReason };

