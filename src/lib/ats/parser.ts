import mammoth from "mammoth";

// Dynamic import or require for pdf-parse to avoid canvas/native compilation issues in Next.js
export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  return data.text || "";
}

export async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

export async function extractTextFromFile(
  fileBuffer: Buffer,
  fileType: string
): Promise<string> {
  if (fileType === "application/pdf" || fileType.endsWith("pdf")) {
    return await parsePdfBuffer(fileBuffer);
  } else if (
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileType.includes("docx") ||
    fileType.includes("word")
  ) {
    return await parseDocxBuffer(fileBuffer);
  } else {
    // Attempt utf-8 text fallback
    return fileBuffer.toString("utf-8");
  }
}
