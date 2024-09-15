import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { UsabilityHeuristicstools } from '@/lib/langchain/tools/agent/usability';
import { AgentExecutor } from "langchain/agents";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";

const createUserbilityTestAgentExecutor = async () => {
	const llm = new ChatOpenAI({
		model: "gpt-4o",
		temperature: 0,
	});

	const prompt = await pull<ChatPromptTemplate>(
		"hwchase17/openai-functions-agent"
	);

	const tools = await Promise.all(UsabilityHeuristicstools);

	const agent = await createOpenAIFunctionsAgent({
		llm,
		tools,
		prompt,
	});

	const agentExecutor = new AgentExecutor({
		agent,
		tools,
	});

	return agentExecutor;
};

export { createUserbilityTestAgentExecutor };