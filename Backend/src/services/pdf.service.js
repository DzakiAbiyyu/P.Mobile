import { PDFParse } from "pdf-parse";

class PdfService {
  async extractText(fileBuffer) {
    try {
      const parser = new PDFParse({ data: fileBuffer });
      const result = await parser.getText();
      return result.text;
    } catch (error) {
      error.status = 500;
      error.message = "Gagal mengekstrak teks dari PDF: " + error.message;
      throw error;
    }
  }
}

export default new PdfService();
