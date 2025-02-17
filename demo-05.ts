import * as fs from "fs/promises";
import { getEmbedding, getFilePaths, readJsonFile } from "./util";
import { TextChunk } from "./types";

// Read our previously created chunks
const fileName = "on_bullshit-chunks.json";
const { path: filePath } = getFilePaths(fileName);
const chunks: TextChunk[] = await readJsonFile(filePath);

// Get embeddings for all chunks
const embeddings = await getEmbedding(
  chunks.map((chunk) => chunk.text) // provide the text only
);

// Combine chunks with their embeddings
const output = chunks.map((chunk, index) => ({
  ...chunk,
  embedding: embeddings[index].embedding,
}));

// Save the chunks with their embeddings
await fs.writeFile(
  `data/on_bullshit-embeddings.json`,
  JSON.stringify(output, null, 2)
);

console.log("Created embeddings for", chunks.length, "chunks");
