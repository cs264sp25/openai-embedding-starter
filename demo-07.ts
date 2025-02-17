import { TextEmbedding } from "./types";
import {
  answerQuestion,
  answerQuestionBasedOnContent,
  findRelevantChunks,
  getFilePaths,
  readJsonFile,
} from "./util";

const question = "How is bullshit different from bluffing?";

// First get an answer without context
let answer = await answerQuestion(question);
console.log("\nAnswer without context:", answer);

// Load our pre-computed embeddings
const fileName = "on_bullshit-embeddings.json";
const { path: filePath } = getFilePaths(fileName);
const embeddings: TextEmbedding[] = await readJsonFile(filePath);

// Now get relevant chunks
const relevantChunks = await findRelevantChunks(embeddings, question);

// Get answer based on the relevant chunks
answer = await answerQuestionBasedOnContent(
  relevantChunks.map((chunk) => chunk.text),
  question,
);

console.log("\nAnswer based on context:", answer);
