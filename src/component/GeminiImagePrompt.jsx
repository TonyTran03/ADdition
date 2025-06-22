// src/component/GeminiImagePrompt.jsx
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); // Use .env key

export default function GeminiImagePrompt() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setImageUrl("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // For now, Gemini only returns a *description* — not image URL.
      // You can use this result + fetch an image from an image API like Unsplash or Lexica
      // For now, as a placeholder, simulate the result:
      const fakeImage = `https://source.unsplash.com/featured/?${encodeURIComponent(
        prompt
      )}`;

      setImageUrl(fakeImage);
    } catch (err) {
      console.error(err);
      setError("Failed to generate image.");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-3 text-white">
      <p className="text-xs text-gray-400">
        Describe a thing to turn it into a photo.
      </p>
      <input
        className="w-full bg-[#1E1E1E] border border-[#3D3D3D] rounded px-2 py-1 text-sm"
        placeholder="e.g. a duck made of toast"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="px-3 py-1 rounded-sm bg-[#6366F1] text-white text-xs hover:bg-indigo-500"
        disabled={loading || !prompt}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated"
          className="rounded mt-3 border border-[#3D3D3D] w-full"
        />
      )}
    </div>
  );
}
