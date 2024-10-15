import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { UsabilityHeuristicstools } from '@/lib/langchain/tools/agent/usability';
import { AgentExecutor } from "langchain/agents";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";

const createUserbilityTestAgentExecutor = async () => {
    const llm = new ChatOpenAI({
        model: "gpt-4o", // Corrected model name
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

    // // Dictionaries to store evaluation data
    // const heuristics_pages: { [key: string]: any } = {};
    // const heuristics_paths: { [key: string]: any } = {};

    // // Example: Evaluate the register page (replace with actual data)
    // const registerPageEvaluation = evaluateInterfaceHeuristics("register_page", "Visibility of system status is unclear.");
    // heuristics_pages["register_page"] = registerPageEvaluation["register_page"];

    // // Example of tracking multi-page issues
    // const trackMultiPageProblems = (pathName: string, relatedPages: string[], observation?: string) => {
    //     heuristics_paths[pathName] = {
    //         "Related page": relatedPages,
    //         "Observation": observation || "Detected problem across multiple pages."
    //     };
    // };

    // // Example usage of multi-page issue tracking
    // trackMultiPageProblems("register to home", ["register_page", "home_page"], "Inconsistent visibility of task progress.");

    // // Overall score computation
    // let overall_score = new Array(10).fill(0);
    // for (const page in heuristics_pages) {
    //     for (let i = 0; i < 10; i++) {
    //         overall_score[i] += heuristics_pages[page]["Heuristics Score"][i];
    //     }
    // }
    // overall_score = overall_score.map(score => score / Object.keys(heuristics_pages).length);

    // console.log("Overall Heuristics Score:", overall_score);
    return agentExecutor;
};

export { createUserbilityTestAgentExecutor };