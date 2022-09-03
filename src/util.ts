import fs from "fs";

export function readBinaryFile(filename: string) {
  const file = fs.readFileSync(filename);
  return new Uint8Array(file);
}
