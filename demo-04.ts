import { getEmbedding } from "./util";

const content = [
  "All that glitters is not gold", // William Shakespeare
  "In three words I can sum up everything I've learned about life: it goes on", // Robert Frost
  "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment", // Ralph Waldo Emerson
  "The only way to do great work is to love what you do", // Steve Jobs
  "Two roads diverged in a wood, and I took the one less traveled by" // Robert Frost
];

// Get embeddings for each piece of content
const embeddings = await getEmbedding(content);

// Let's look at one embedding
console.log("\nFirst text:", content[0]);
console.log("Its embedding (first 5 numbers):",
  embeddings[0].embedding.slice(0, 5));

// Print dimension of the embedding space
console.log("\nEmbedding dimension:",
  embeddings[0].embedding.length);