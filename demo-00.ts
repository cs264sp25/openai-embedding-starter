import { countTokens, extractText, getFilePaths } from "./util";

// Choose which file to analyze
const fileName = "Metamorphosis.txt";
// const fileName = "War-and-Peace.txt";

// Get the file path using our utility function
const { path: filePath } = getFilePaths(fileName);

// Extract the text from the file
const text = await extractText(filePath);

// Count the tokens
const count = countTokens(text);

console.log(`Extracted ${count} tokens from the ${fileName} file.`);