import { ChatOpenAI } from "@langchain/openai";

const createPersonaTestAgent = async (temperature: number) => {

	const model = new ChatOpenAI({
		model: "gpt-4o",
		temperature: temperature
	});

	return model;
};

export { createPersonaTestAgent };