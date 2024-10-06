import { TextLoader } from "langchain/document_loaders/fs/text";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { createRetrieverTool } from "langchain/tools/retriever";
import { ToolNode } from "@langchain/langgraph/prebuilt";

const filenames = ["src/index.ts", "src/rag.ts", "src/structured-output.ts"];

const docs = await Promise.all(
  filenames.map((filename) => new TextLoader(filename).load()),
);
const docsList = docs.flat();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});
const docSplits = await textSplitter.splitDocuments(docsList);

// Add to vectorDB
const vectorStore = await MemoryVectorStore.fromDocuments(
  docSplits,
  new GoogleGenerativeAIEmbeddings(),
);

const retriever = vectorStore.asRetriever();

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
});
console.log(GraphState.State);

const tool = createRetrieverTool(retriever, {
  name: "retrieve_blog_posts",
  description: "Search and return information about local files.",
});
const tools = [tool];

const toolNode = new ToolNode<typeof GraphState.State>(tools);

console.log(toolNode);
