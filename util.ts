import * as mupdfjs from "mupdf/mupdfjs";
import * as fs from "fs/promises";
import { encoding_for_model, TiktokenModel } from "tiktoken";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./env";
import path from "path";
import {
  FileData,
  TextChunk,
  TextChunkEmbedding,
  TextEmbedding,
} from "./types";

// Initialize OpenAI client with API key
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Constructs file paths and extracts file information
export function getFilePaths(fileName: string): FileData {
  // Get full path in data directory
  const cwd = process.cwd();
  const fullPath = path.join(cwd, 'data', fileName);

  // Extract file extension and base name
  const fileExtension = path.extname(fileName);
  const fileNameWithoutExtension = path.basename(fileName, fileExtension);

  return {
    path: fullPath,
    name: fileNameWithoutExtension,
    ext: fileExtension,
  };
}

// File reading utilities
export async function readTextFile(filePath: string) {
  return fs.readFile(filePath, "utf-8");
}

export async function readPdfFile(filePath: string) {
  return fs.readFile(filePath);
}

export async function readJsonFile(filePath: string) {
  return fs.readFile(filePath, "utf-8").then(JSON.parse);
}

// Extracts text from PDF or text files
export async function extractText(filePath: string) {
  // Handle text files directly
  if (filePath.endsWith(".txt")) {
    return readTextFile(filePath);
  }

  if (!filePath.endsWith(".pdf")) {
    throw new Error("File must be a PDF or text file.");
  }

  // Load and parse PDF document
  const dataBuffer = await readPdfFile(filePath);
  const doc = mupdfjs.PDFDocument.openDocument(dataBuffer, "application/pdf");

  let fullText = [];

  // Process each page of the PDF
  for (let i = 0; i < doc.countPages(); i++) {
    const page = new mupdfjs.PDFPage(doc, i);
    const json = page.toStructuredText("preserve-whitespace").asJSON();

    try {
      const parsed = JSON.parse(json);
      
      // Extract and join text from all text blocks
      const pageText = parsed.blocks
        .filter((block) => block.type === "text")
        .flatMap((block) => block.lines)
        .map((line) => line.text)
        .join("\n");

      fullText.push(pageText);
    } catch (error) {
      console.error(`Error parsing page ${i}:`, error);
    }
  }

  // Join all pages with double newlines
  return fullText.join("\n\n");
}

// Calculates token count for text using specified model
export function countTokens(text: string, model = "gpt-4o") {
  // Encode text and count tokens
  const encoder = encoding_for_model(model as TiktokenModel);
  const tokens = encoder.encode(text);
  encoder.free();
  return tokens.length;
}

// Divides text into overlapping chunks for processing
export function createChunks(
  text: string,
  chunkSize = 100,
  overlap = 20,
  metadata: Record<string, any> = {},
): TextChunk[] {
  const chunks: TextChunk[] = [];
  
  // Split text into words and calculate chunk parameters
  const words = text.split(/\s+/);
  const chunkWords = Math.floor(chunkSize);
  const overlapWords = Math.floor(overlap);

  // Create overlapping chunks using sliding window
  for (let i = 0; i < words.length; i += chunkWords - overlapWords) {
    const startWordIndex = i;
    const endWordIndex = Math.min(i + chunkWords, words.length);
    const currentSlice = words.slice(startWordIndex, endWordIndex);
    const chunkText = currentSlice.join(" ");

    // Only include chunks with substantial content
    if (chunkText.length > 100) {
      chunks.push({
        text: chunkText,
        counts: {
          words: currentSlice.length,
          characters: chunkText.length,
        },
        position: {
          start: startWordIndex,
          end: endWordIndex - 1,
        },
        metadata,
      });
    }
  }
  return chunks;
}

// Generates embeddings for text using OpenAI's API
export async function getEmbedding(
  text: string | string[],
): Promise<TextEmbedding | TextEmbedding[]> {
  try {
    // Get embeddings from OpenAI
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    
    // Handle array or single text input
    if (Array.isArray(text)) {
      return response.data.map((item, index) => ({
        text: text[index],
        embedding: item.embedding,
      }));
    } else {
      return {
        text,
        embedding: response.data[0].embedding,
      };
    }
  } catch (error) {
    console.error("Error getting embedding:", error);
    throw error;
  }
}

// Sends direct questions to GPT-4 for answers
export async function answerQuestion(question: string) {
  try {
    // Query OpenAI with the question
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error querying OpenAI:", error);
    throw error;
  }
}

// Answers questions using provided context
export async function answerQuestionBasedOnContent(
  content: string | string[],
  question: string,
) {
  try {
    // Format content into a readable prompt structure
    const flattenedContent = Array.isArray(content)
      ? content
          .map(
            (item) => `"""
${item}
"""`,
          )
          .join("\n")
      : content;

    // Construct prompt with context and question
    const prompt = `Context:

${flattenedContent}

Question: ${question}

Please answer the question based only on the context provided above. If the answer cannot be found in the context, say "I cannot answer this based on the provided content."`;

    // Get response from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error querying OpenAI:", error);
    throw error;
  }
}

// Calculates similarity between two vectors using cosine similarity
export function cosineSimilarity(vecA: number[], vecB: number[]) {
  // Calculate dot product of the vectors
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);

  // Calculate magnitudes
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  // Return cosine similarity
  return dotProduct / (magnitudeA * magnitudeB);
}

// Finds text chunks most relevant to a question
export async function findRelevantChunks(
  embeddings: TextChunkEmbedding[],
  question: string,
  numChunks = 3
): Promise<TextChunkEmbedding[]> {
  // Get embedding for the question
  const questionEmbedding = await getEmbedding(question);

  // Calculate similarity scores for all chunks
  const similarities = embeddings.map((emb, index) => ({
    index,
    similarity: cosineSimilarity(
      (questionEmbedding as TextEmbedding).embedding,
      emb.embedding
    ),
  }));

  // Sort by similarity and return top chunks
  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities
    .slice(0, numChunks)
    .map(sim => embeddings[sim.index]);
}
