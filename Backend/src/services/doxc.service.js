import mammoth from "mammoth";

class DocxService {
  async extractText(fileBuffer) {
    try {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value;
    } catch (error) {
      error.status = 500;
      error.message = "Gagal mengekstrak teks dari DOCX: " + error.message;
      throw error;
    }
  }
}

export default new DocxService();
