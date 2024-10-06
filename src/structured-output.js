import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import process from "process";

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash",
  maxOutputTokens: 2048,
});

const library = z.object({
  intent: z.string().describe("The intent of the message"),
  amount: z.string().describe("The quantity asked for ranging from 0 to 100"),
  unit: z.string().describe("Units for action"),
  delay: z
    .string()
    .describe("The delay asked for in seconds. If unknown return 0"),
  summary: z.string().describe("Summary of the action"),
  suggestions: z
    .string()
    .describe(
      "Options for what could be done next as semi colon separated list",
    ),
  tone: z.string().describe("What was the tone and mood of the request?"),
});

const DEFAULT_MESSAGE =
  "Can you turn the volume to a quiet level in 10 minutes?";
const args = process.argv.slice(2);
const message = args.length > 0 ? args.join(" ") : DEFAULT_MESSAGE;

const response = await model.withStructuredOutput(library).invoke(message);
console.log(response);
