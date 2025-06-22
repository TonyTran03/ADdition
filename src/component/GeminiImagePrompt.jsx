import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load the Gemini API key from your .env file
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function GeminiImagePrompt() {
  const [prompt, setPrompt] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setLoading(true);
    setError("");
    setImageBase64("");

    try {
      const model = genAI.getGenerativeModel({
        model: "models/gemini-1.5-pro-latest",
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: `Generate an image of: ${prompt}` }],
          },
        ],
        generationConfig: {
          responseMimeType: "image/png",
        },
      });

      const imagePart = result.response.parts[0];

      if (imagePart.inlineData) {
        setImageBase64(imagePart.inlineData.data); // base64-encoded PNG
      } else {
        setError("No image returned.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong generating the image.");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-3 text-white">
      <p className="text-xs text-gray-400">
        What would you like to like a 3d model of?
      </p>
      <input
        className="w-full bg-[#1E1E1E] border border-[#3D3D3D] rounded px-2 py-1 text-sm"
        placeholder="e.g. a robotic duck made of gold"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={generateImage}
        className="px-3 py-1 rounded-sm bg-[#6366F1] text-white text-xs hover:bg-indigo-500"
        disabled={loading || !prompt}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {imageBase64 && (
        <img
          src={`data:image/png;base64,${imageBase64}`}
          alt="Generated"
          className="rounded mt-3 border border-[#3D3D3D] w-full"
        />
      )}
    </div>
  );
}
