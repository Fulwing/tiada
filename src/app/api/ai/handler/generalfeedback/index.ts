// Import necessary modules
import { createUserbilityTestAgentExecutor } from '@/lib/langchain/agent/userbilityTest';
import ConversationEntry from '@/types/test/chat';

// This function should not be exported in the same way as HTTP methods
export async function getUsabilityTestFeedback(conversationHistory: ConversationEntry[]): Promise<string> {
    try {
        const agentExecutor = await createUserbilityTestAgentExecutor();

        const response = await agentExecutor.invoke({
            input: `You are a usability expert evaluating a system based on the following conversation history. 
            
            Your task is to assess the system's usability according to Jakob Nielsen's 10 usability heuristics:
            1. Visibility of System Status
            2. Match Between System and Real World
            3. User Control and Freedom
            4. Consistency and Standards
            5. Error Prevention
            6. Recognition Rather Than Recall
            7. Flexibility and Efficiency of Use
            8. Aesthetic and Minimalist Design
            9. Help Users Recognize, Diagnose, and Recover from Errors
            10. Help and Documentation

            For each heuristic, provide:
            - A score from 0-5 (0 = very poor, 5 = excellent).
            - Specific observations related to this heuristic from the conversation.
            - Provide general detailed suggestions or expectations on the interface, be specific on which page and part of the interface, if needed.
            
            In addition, if there are any usability problems related to multiple pages or parts of the system, describe those and suggest a solution.

            Please format the feedback as follows:
            1. **Visibility of System Status**: 
               - Score: X
               - Observation: [Detailed observation]
               - Suggestion: [Improvement suggestion, if needed]
               
            [Continue similarly for the rest of the heuristics]
            
            After evaluating the heuristics, provide an overall assessment, including an average score for each heuristic across the system.`,
            chat_history: conversationHistory,
        });

        return response.output.trim();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}
