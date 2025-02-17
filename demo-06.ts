import { TextEmbedding } from "./types";
import { findRelevantChunks, getFilePaths, readJsonFile } from "./util";

// Define our question
const question = "How is bullshit different from bluffing?";

// Load our pre-computed embeddings
const fileName = "on_bullshit-embeddings.json";
const { path: filePath } = getFilePaths(fileName);
const embeddings: TextEmbedding[] = await readJsonFile(filePath);

// Find relevant chunks
const relevantChunks = await findRelevantChunks(embeddings, question);

// Display the results
console.log("\nQuestion:", question);
console.log("\nMost relevant chunks:");
relevantChunks.forEach((chunk, i) => {
  console.log(`\n${i + 1}. ${chunk.text}`);
});
