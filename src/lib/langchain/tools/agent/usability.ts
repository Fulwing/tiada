import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createRetrieverTool } from "langchain/tools/retriever";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from 'path';  // Import path to correctly reference file paths

// Sample usability heuristics documents
const initialDocuments = [
    new Document({ pageContent: 'Visibility of System Status: Ensure system keeps users informed about its status at all times.' }),
    new Document({ pageContent: 'Error Prevention: Design should eliminate or minimize errors by preventing problematic actions before they occur.' }),
    new Document({ pageContent: 'User Control and Freedom: Ensure users can easily control and navigate the system, with options to undo actions or access emergency exits.' }),
    new Document({ pageContent: 'Consistency and Standards: Maintain consistent design elements and standard actions throughout the system.' }),
    new Document({ pageContent: 'Recognition Rather than Recall: Design interfaces that reduce memory load by providing clear visual cues and prompts.' }),
    new Document({ pageContent: 'Flexibility and Efficiency of Use: Allow advanced users to find shortcuts and streamline their work.' }),
    new Document({ pageContent: 'Aesthetic and Minimalist Design: Keep the interface free of unnecessary elements, focusing on simplicity and clarity.' }),
    new Document({ pageContent: 'Help Users Recover from Errors: Provide clear and constructive error messages and recovery options.' }),
    new Document({ pageContent: 'Help and Documentation: Ensure help documentation is accessible and contextual, providing necessary guidance to users.' }),
];

async function UsabilityHeuristicsRetriever() {
    const pdf1Path = path.join(process.cwd(), 'public', 'RAG', 'GeneralFeedback', 'Heuristic_Workbook.pdf');
    const pdf2Path = path.join(process.cwd(), 'public', 'RAG', 'GeneralFeedback', 'UX_Book.pdf');

    // Load PDFs using PDFLoader
    try {
        const loader1 = new PDFLoader(pdf1Path);
        const docs1 = await loader1.load();
        console.log(`PDF 1 loaded successfully. Number of documents: ${docs1.length}`);
        
        const loader2 = new PDFLoader(pdf2Path);
        const docs2 = await loader2.load();
        console.log(`PDF 2 loaded successfully. Number of documents: ${docs2.length}`);

        // Combine initial documents with PDF documents
        const pdfDocuments = [...docs1, ...docs2];
        const allDocs = [...initialDocuments, ...pdfDocuments];

        // Split the documents into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const splitDocs = await splitter.splitDocuments(allDocs);

        // Create a vector store from the documents
        const vectorstore = await MemoryVectorStore.fromDocuments(
            splitDocs,
            new OpenAIEmbeddings()
        );

        // Create retriever tool
        const retriever = vectorstore.asRetriever();

        const retrieverTool = createRetrieverTool(retriever, {
            name: "agent_usability_heuristics_retriever",
            description: "Let agent reply based on the usability heuristics.",
        });

        return retrieverTool;
    } catch (error) {
        console.error("Error loading PDFs or processing documents:", error);
        throw error;
    }
}

export const UsabilityHeuristicstools = [UsabilityHeuristicsRetriever()];
