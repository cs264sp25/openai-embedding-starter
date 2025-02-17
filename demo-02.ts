import * as fs from "fs/promises";
import {
  countTokens,
  createChunks,
  extractText,
  getFilePaths
} from "./util";

const fileName = "on_bullshit.txt";
const { path: filePath, name } = getFilePaths(fileName);

// Extract text from file
const text = await extractText(filePath);

// Create chunks with 100 words and 20 words overlap
const chunks = createChunks(text, 100, 20);

// Save chunks with metadata for inspection
await fs.writeFile(
  `data/${name}-chunks.json`,
  JSON.stringify(
    chunks.map((chunk) => ({
      ...chunk,
      counts: {
        ...chunk.counts,
        tokens: countTokens(chunk.text),
      },
    })),
    null,
    2
  )
);

console.log(`Created ${chunks.length} chunks from ${fileName}`);
console.log(`Saved chunks to ${name}-chunks.json`);