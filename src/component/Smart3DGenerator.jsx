import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Configuration, OpenAIApi } from "openai";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const openai = new OpenAIApi(
  new Configuration({ apiKey: import.meta.env.VITE_OPENAI_API_KEY })
);

export default function Smart3DGenerator({ onModelGenerated }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const generate3D = async () => {
    setLoading(true);
    setStatus("Expanding prompt with Gemini...");
    try {
      // 1. Expand prompt
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const geminiRes = await model.generateContent(
        `Make this a vivid image prompt for AI image generation: "${prompt}"`
      );
      const expanded = await geminiRes.response.text();

      // 2. Generate image
      setStatus("Generating image from DALL·E...");
      const dalleRes = await openai.createImage({
        prompt: expanded,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      });
      const imgUrl = dalleRes.data.data[0].url;
      setImageUrl(imgUrl);

      // 3. Send image to Tripo API
      setStatus("Sending image to 3D model reconstruction...");
      const imgBlob = await (await fetch(imgUrl)).blob();
      const formData = new FormData();
      formData.append("image", imgBlob, "image.png");

      const tripoRes = await fetch(
        "https://hf.space/embed/ziqingyang/tripo/+/api/predict",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await tripoRes.json();
      const modelUrl = result.data[0]; // .glb

      setStatus("Model ready! Importing...");
      onModelGenerated(modelUrl);
    } catch (err) {
      console.error("Error:", err);
      setStatus("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 text-white">
      <input
        placeholder="e.g. a duck made of crystals"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full bg-[#1E1E1E] border border-[#3D3D3D] px-2 py-1 text-sm rounded"
      />
      <button
        onClick={generate3D}
        disabled={loading || !prompt}
        className="bg-[#6366F1] text-xs px-3 py-1 rounded hover:bg-indigo-500"
      >
        {loading ? "Processing..." : "Generate 3D Model"}
      </button>
      {status && <p className="text-xs text-gray-400">{status}</p>}
      {imageUrl && <img src={imageUrl} className="rounded w-full mt-2" />}
    </div>
  );
}
