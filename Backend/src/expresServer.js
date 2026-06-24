import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AnalysisController, { upload } from "./controller/analysis.controller.js";

export const createServer = () => {
  const app = express();

  // Middleware dasar
  app.use(cors()); // SANGAT PENTING: Jangan lupakan cors() agar bisa ditembak dari Chrome/Flutter
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(cookieParser());

  // 1. PERBAIKAN: "ok" sekarang dibungkus tanda kutip agar menjadi string asli
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 2. Daftarkan rute untuk analisis dokumen skripsi kamu di sini
  app.post("/api/v1/analysis/analyze", upload.single("file"), AnalysisController.analyzeDocument);

  // 3. PERBAIKAN: Global Error Handler yang sudah dibersihkan dari variabel gaib
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const serverMessage =
      err.serverMessage || err.message || "Internal Server Error";

    // Definisikan userMessage terlebih dahulu agar bisa dipakai di dalam objek log
    const userMessage =
      status === 500 ? "Terjadi kesalahan pada server" : serverMessage;

    // Menyelaraskan nama variabel menjadi logData sejak awal
    const logData = {
      path: req.path,
      method: req.method,
      status,
      userMessage,
    };

    // Pengecekan aman untuk logger: Jika variabel 'logger' global belum dibuat, pakai console
    if (status >= 500) {
      logData.stack = err.stack;
      if (typeof logger !== "undefined") {
        logger.error(serverMessage, logData);
      } else {
        console.error(`[ERROR 500] ${serverMessage}`, logData);
      }
    } else {
      if (typeof logger !== "undefined") {
        logger.warn(serverMessage, logData);
      } else {
        console.warn(`[WARN ${status}] ${serverMessage}`, logData);
      }
    }

    res.status(status).json({
      status: "error",
      message: serverMessage,
      userMessage: userMessage,
      errors: err.errors,
    });
  });

  return app;
};
