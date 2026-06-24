import saplingService from "../services/sapling.service.js";
import multer from "multer";

// Simpan file di memori (bukan di disk) agar langsung bisa diproses sebagai Buffer
const storage = multer.memoryStorage();
export const upload = multer({ storage });

class AnalysisController {
  async analyzeDocument(req, res, next) {
    try {
      // 🔍 DEBUG: Lihat apa yang diterima backend
      console.log('[DEBUG] Content-Type:', req.headers['content-type']);
      console.log('[DEBUG] req.file:', req.file);
      console.log('[DEBUG] req.body keys:', Object.keys(req.body || {}));

      // File dikirim langsung dari Flutter via multipart/form-data
      const file = req.file;

      if (!file) {
        const error = new Error("File wajib dikirim");
        error.status = 400;
        error.serverMessage = "Bad Request: No file uploaded";
        return next(error);
      }

      const fileName = file.originalname;
      const fileBuffer = file.buffer;

      console.log(`[INFO] Menerima file: ${fileName} (${fileBuffer.length} bytes)`);

      // Jalankan bisnis logic di service (ekstrak teks + cek AI)
      const result = await saplingService.processFileAnalysis(
        fileName,
        fileBuffer,
      );

      // Kirimkan response balik ke mobile app jika berhasil
      return res.status(200).json({
        status: "Success",
        message: "Analisis AI berhasil dilakukan",
        data: {
          percentage: result.percentage,
          details: result.details,
        },
      });
    } catch (err) {
      // 🔍 DEBUG ERROR: Mencetak letak eror asli di terminal backend
      console.error("[DEBUG ERROR] Terjadi kegagalan di Controller:", err.message);
      console.error("[DEBUG STACK]", err.stack);

      err.status = err.status || 500;
      err.serverMessage = err.message || "Gagal memproses analisis dokumen";
      next(err);
    }
  }
}

export default new AnalysisController();
