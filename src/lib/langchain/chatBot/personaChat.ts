import { ChatOpenAI } from "@langchain/openai";

const createPersonaChatAgent = async (temperature: number) => {

	const model = new ChatOpenAI({
		model: "gpt-4o-mini",
		temperature: temperature
	});

	return model;
};

export { createPersonaChatAgent };