import dotenv from "dotenv";
dotenv.config();

import { createServer } from "./expresServer.js"; // Typo nama file disamakan
import { initMinio } from "./minio.js";

const app = createServer();
const PORT = process.env.PORT || 3000;

const startServer = () => {
  initMinio(); // Panggil log inisialisasi MinIO kamu
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
