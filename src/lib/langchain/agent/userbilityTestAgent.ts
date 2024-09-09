import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { UsabilityHeuristicstools } from '@/lib/langchain/tools/agent/usability';
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";

const createUserbilityTestAgent = async () => {
	const llm = new ChatOpenAI({
		model: "gpt-4o",
		temperature: 0,
	});

	const prompt = await pull<ChatPromptTemplate>(
		"hwchase17/openai-functions-agent"
	);

	const tools = await Promise.all(UsabilityHeuristicstools);

	return await createOpenAIFunctionsAgent({
		llm,
		tools,
		prompt,
	});
};

export { createUserbilityTestAgent };