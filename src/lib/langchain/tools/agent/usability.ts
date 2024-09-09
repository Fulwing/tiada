import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createRetrieverTool } from "langchain/tools/retriever";

// Sample usability heuristics documents
const document = [
    new Document({ pageContent: 'Visibility of System Status: Ensure system keeps users informed about its status at all times.' }),
    new Document({ pageContent: 'Error Prevention: Design should eliminate or minimize errors by preventing problematic actions before they occur.' }),
    new Document({ pageContent: 'User Control and Freedom: Ensure users can easily control and navigate the system, with options to undo actions or access emergency exits.' }),
    new Document({ pageContent: 'Consistency and Standards: Maintain consistent design elements and standard actions throughout the system.' }),
    new Document({ pageContent: 'Error Prevention: Design should eliminate or minimize errors by preventing problematic actions before they occur.' }),
    new Document({ pageContent: 'Recognition Rather than Recall: Design interfaces that reduce memory load by providing clear visual cues and prompts.' }),
    new Document({ pageContent: 'Flexibility and Efficiency of Use: Allow advanced users to find shortcuts and streamline their work.' }),
    new Document({ pageContent: 'Aesthetic and Minimalist Design: Keep the interface free of unnecessary elements, focusing on simplicity and clarity.' }),
    new Document({ pageContent: 'Help Users Recover from Errors: Provide clear and constructive error messages and recovery options.' }),
    new Document({ pageContent: 'Help and Documentation: Ensure help documentation is accessible and contextual, providing necessary guidance to users.' }),
];

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

async function UsabilityHeuristicsRetriever() {
    const docs = await splitter.splitDocuments(document);
    const vectorstore = await MemoryVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings()
    );
    const retriever = vectorstore.asRetriever();

    const retrieverTool = createRetrieverTool(retriever, {
        name: "agent_usability_heuristics_retriever",
        description:
          "Let agent reply based on the usability heuristics.",
    });

    return retrieverTool;
}

export const UsabilityHeuristicstools = [UsabilityHeuristicsRetriever()];