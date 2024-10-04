import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash",
  maxOutputTokens: 2048,
});
const response = await model.invoke("Hello world!");
console.log(response);
