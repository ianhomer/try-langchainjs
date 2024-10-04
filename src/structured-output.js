import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash",
  maxOutputTokens: 2048,
});

const library = z.object({
  name: z.string().describe("The name of the library"),
  provider: z.string().describe("The developer of the library"),
  created: z.number().describe("The year that the library was created"),
  popularity: z.number().describe("How popular the library is, from 1 to 10"),
  notes: z.string().describe("Full details"),
});
const response = await model
  .withStructuredOutput(library)
  .invoke("Give top JS library is good for logging");
console.log(response);
