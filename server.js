// ==============================
// ✅ Import Dependencies
// ==============================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

// ==============================
// ✅ Configuration Setup
// ==============================
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ==============================
// ✅ MongoDB Connection (Optional)
// ==============================
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB error:", err));
} else {
  console.warn("⚠️ MongoDB not configured — skipping database connection");
}

// ==============================
// ✅ Gemini AI Setup
// ==============================
let geminiModel;
try {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  console.log("✅ Gemini AI connected successfully");
} catch (err) {
  console.error("❌ Gemini initialization failed:", err);
}

// ==============================
// ✅ API Endpoint
// ==============================
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!geminiModel) {
      return res.status(500).json({ error: "Gemini model not initialized" });
    }

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    res.json({ result: text });
  } catch (err) {
    console.error("❌ Gemini API Error:", err);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// ==============================
// ✅ Serve Frontend (index.html)
// ==============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (index.html in same folder or /public)
app.use(express.static(__dirname));

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ==============================
// ✅ Start Server
// ==============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
