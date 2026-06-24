import axios from "axios";

// Batas karakter yang dikirim ke Sapling API (free tier ~5000 chars)
const MAX_CHARS = 5000;

class SaplingInfrastructure {
  async checkAiContent(text) {
    // Potong teks agar tidak melebihi batas API
    const truncatedText = text.slice(0, MAX_CHARS);
    console.log(`[INFO] Mengirim ${truncatedText.length} karakter ke Sapling API`);

    try {
      const response = await axios.post(
        "https://api.sapling.ai/api/v1/aidetect",
        {
          text: truncatedText,
          key: process.env.SAPLING_API_KEY,
        },
        {
          timeout: 30000, // Timeout 30 detik
        }
      );
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      let message = "Sapling API Error";

      if (status === 429) {
        message = "Sapling API: Terlalu banyak request. Tunggu 1 menit lalu coba lagi.";
      } else if (status === 504 || status === 503) {
        message = "Sapling API: Server timeout. Coba lagi beberapa saat.";
      } else {
        message = "Sapling API Error: " + (error.response?.data?.message || error.message);
      }

      error.status = 502;
      error.message = message;
      throw error;
    }
  }
}

export default new SaplingInfrastructure();
