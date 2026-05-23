import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: Analisis Sinyal AI menggunakan Gemini
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { stationName, operator, channelFreq, distanceKm, bearing, province, city, channels } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY || (req.headers["x-gemini-key"] as string);
      
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        return res.status(400).json({ 
          error: "Gemini API Key belum dikonfigurasi. Silakan tambahkan GEMINI_API_KEY di panel Secrets atau Settings aplikasi." 
        });
      }
      
      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      const systemPrompt = `Anda adalah Asisten Sinyal TV Digital Cerdas Indonesia yang ahli dalam RF (Radio Frequency), pemetaan sinyal UHF, konfigurasi setup antena rumah tangga DVB-T2, dan topografi wilayah Indonesia. Tugas Anda adalah memberikan analisis berdasar kalkulasi jarak, bearing, daya UHF pancar, saluran TV, dan halangan gedung perkotaan.`;

      const promptMsg = `Analisislah penerimaan sinyal TV digital dari stasiun pemancar berikut:
- Nama Stasiun MUX: ${stationName}
- Operator: ${operator}
- Frekuensi/Mux: UHF Saluran ${channelFreq}
- Jarak Penerima ke Pemancar: ${distanceKm ? distanceKm.toFixed(2) : "Unknown"} km
- Arah Antena (Bearing): ${bearing ? bearing.toFixed(1) : "Unknown"}°
- Lokasi Pemancar: ${city}, ${province}
- Daftar Saluran TV: ${channels ? channels.join(", ") : "Tidak ditentukan"}

Toleransi halangan: Asumsikan rumah berada di perkotaan padat/semi-perkotaan dengan halangan sedang (medium obstacles seperti pohon/gedung).
Berikan saran teknis dalam Bahasa Indonesia yang gaul, keren, modern, praktis, dan singkat (maksimal 150 kata). Tentukan secara matematis yang realistis:
1. Jenis Antena yang cocok (Yagi Outdoor High Gain, Yagi Medium, Antena Indoor Grid, dll)
2. Tinggi Antena yang disarankan (dalam meter, misal: 10)
3. Booster tambahan dibutuhkan? (true atau false)
4. Perkiraan tingkat kekuatan sinyal di lokasi dalam dBm (misal: -68 dBm, harus bilangan bulat negatif)
5. Status Kualitas Sinyal (SANGAT BAIK/BAIK/CUKUP/LEMAH/SANGAT LEMAH)
6. Tips optimasi posisi antena mengarah pas ke ${bearing ? bearing.toFixed(1) : "Unknown"}° (bearing) agar siaran lancar bebas freeze.

Kembalian WAJIB berupa JSON murni dengan format persis seperti ini:
{
  "antennaType": "misal: Antena Yagi Outdoor High Gain",
  "antennaHeightMeters": 10,
  "boosterNeeded": true,
  "estSignalDb": -68,
  "estSignalStatus": "BAIK",
  "description": "Deskripsi gaul dan teknis mengenai optimasi sinyal TV Anda dan analisis saluran... "
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptMsg,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        }
      });
      
      const textResponse = response.text || "{}";
      const cleanedResponse = textResponse.trim();
      res.json({ result: JSON.parse(cleanedResponse) });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: err.message || "Terjadi kesalahan pada analisis Gemini AI." });
    }
  });

  // Serve static assets or mount Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
