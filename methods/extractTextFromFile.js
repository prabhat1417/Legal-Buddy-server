import fs from "fs"; // Node.js filesystem module
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import * as mammoth from "mammoth"; // For document extraction

async function extractTextFromFile(filePath) {
    console.log("Extracting text...");
  const fileExtension = filePath.split(".").pop().toLowerCase();

  try {
    if (fileExtension === "pdf") {
      // Handle PDF file
      const pdfDocument = await pdfjsLib.getDocument(filePath).promise;
      const numPages = pdfDocument.numPages;
      const pageTexts = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const pageTextContent = await page.getTextContent();
        const pageText = pageTextContent.items.map((item) => item.str).join("");
        pageTexts.push(pageText);
      }

      return pageTexts.join("");
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      // Handle image files using OCR
      const {
        data: { text },
      } = await Tesseract.recognize(filePath, "eng");
      return text;
    } else if (["docx", "pptx", "xlsx"].includes(fileExtension)) {
      // Handle document files
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    return null;
  }
}





export default extractTextFromFile;