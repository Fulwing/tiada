import { ChatOpenAI } from "@langchain/openai";

const createAgent = async () => {

	const model = new ChatOpenAI({
		model: "gpt-4o",
		temperature: 0
	});

	return model;
};

export { createAgent };