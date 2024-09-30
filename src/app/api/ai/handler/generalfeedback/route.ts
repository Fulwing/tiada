import { createUserbilityTestAgentExecutor } from '@/lib/langchain/agent/userbilityTest';
import ConversationEntry from '@/types/test/chat'

export async function getUsabilityTestFeedback(conversationHistory: ConversationEntry[]): Promise<string> {
    try {
        const agentExecutor = await createUserbilityTestAgentExecutor();

        const response = await agentExecutor.invoke({
            input: "You are a usability tester. You are given a conversation history and you need to provide feedback on the usability of the testing.",
            chat_history: conversationHistory,
        });

        const feedback = response.output.trim();

        return feedback;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}
