export interface FileData {
  path: string; // absolute path to the file
  name: string; // file name without extension
  ext: string; // file extension
  data?: Buffer; // file data
}

export interface TextChunk {
  text: string; // the content of the chunk
  counts?: { // statistics about the text
    words: number;
    characters: number;
    tokens?: number;
  };
  position?: { // position of the text in the original text
    start: number; // start index of the chunk
    end: number; // end index of the chunk (inclusive)
  };
  metadata?: Record<string, any>; // metadata about the original text
}

export interface TextEmbedding {
  text: string;
  embedding: number[]; // a vector of floats
}

export interface TextChunkEmbedding extends TextChunk {
  embedding: number[]; // a vector of floats
}