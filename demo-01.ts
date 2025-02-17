import * as fs from "fs/promises";
import { countTokens, extractText, getFilePaths } from "./util";

const fileName = "on_bullshit.pdf";

const { path: filePath, name } = getFilePaths(fileName);

// Extract text from the PDF
const text = await extractText(filePath);

// Count tokens in the extracted text
const count = countTokens(text);

// Save the extracted text for inspection
fs.writeFile(`data/${name}.txt`, text);
console.log(`Extracted ${count} tokens from the ${fileName} file.`);