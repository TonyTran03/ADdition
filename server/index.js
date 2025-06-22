import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import multer from "multer";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_KEY,
}));

app.post("/api/dalle", async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    res.json({ url: result.data.data[0].url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Later: Add route for Tripo or any 3D reconstruction

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
