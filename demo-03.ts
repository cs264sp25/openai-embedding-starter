import {
  answerQuestionBasedOnContent,
  extractText,
  getFilePaths,
} from "./util";

// Choose which file to analyze
const fileName = "on_bullshit.txt";

const { path: filePath } = getFilePaths(fileName);

// Extract the text from the file
const text = await extractText(filePath);

// Define our question
const question = "How is bullshit different from bluffing?";

// Answer the question based on the content
const answer = await answerQuestionBasedOnContent(text, question);

// Display the results
console.log("\nAnswer:", answer);
