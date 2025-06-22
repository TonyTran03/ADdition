// src/component/GeminiChat.jsx
import { useState } from "react";

export default function GeminiChat() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("https://your-walle-server.com/api/generate-3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponses([...responses, { prompt, result: data.reply }]);
      setPrompt("");

      if (data.modelUrl) {
        // Optional: auto-add to canvas
        editorState.addModelFromUrl(data.modelUrl);
      }
    } catch (err) {
      console.error(err);
      setResponses([
        ...responses,
        { prompt, result: "Error generating model." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex-1 overflow-y-auto space-y-2 bg-[#1E1E1E] p-2 rounded">
        {responses.map((r, i) => (
          <div key={i} className="text-xs text-white">
            <div className="font-bold text-indigo-400">You:</div>
            <div>{r.prompt}</div>
            <div className="mt-1 font-bold text-green-400">Gemini/WallE:</div>
            <div>{r.result}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 px-2 py-1 text-sm bg-[#2A2A2A] text-white border border-[#3D3D3D] rounded"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your idea (e.g. 'a flying toaster')"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
