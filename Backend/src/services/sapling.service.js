import pdfService from "./pdf.service.js";
import docxService from "./doxc.service.js";
import saplingInfrastructure from "../infrastruckture/sapling.service.js";

class SaplingService {
  async processFileAnalysis(fileName, fileBuffer) {
    let extractedText = "";

    if (fileName.endsWith(".pdf")) {
      extractedText = await pdfService.extractText(fileBuffer);
    } else if (fileName.endsWith(".docx")) {
      extractedText = await docxService.extractText(fileBuffer);
    } else {
      const error = new Error(
        "Format file tidak didukung. Hanya menerima .pdf dan .docx",
      );
      error.status = 400;
      throw error;
    }

    // Kirim teks bersih ke infrastruktur Sapling API
    const apiResponse =
      await saplingInfrastructure.checkAiContent(extractedText);

    const aiScore = apiResponse.score; // Mengambil nilai (misal: 0.82)
    const percentage = Math.round(aiScore * 100); // Mengubah ke persen (82%)

    return {
      percentage,
      details: apiResponse, // Menyimpan format JSON utuh untuk fitur highlight masa depan
    };
  }
}

export default new SaplingService();
