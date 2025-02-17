import OpenAI from "openai";
import { OPENAI_API_KEY } from "./env";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function chat(prompt: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message;
}

chat("Hey! Why is there something rather than nothing?").then(console.log);
