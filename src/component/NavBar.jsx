import { useState, useEffect } from "react";
import { createXRStore } from "@react-three/xr";

const xrStore = createXRStore();

export default function NavBar() {
  const [arSupported, setArSupported] = useState(null);

  useEffect(() => {
    if (navigator.xr?.isSessionSupported) {
      navigator.xr
        .isSessionSupported("immersive-ar")
        .then((supported) => setArSupported(supported))
        .catch(() => setArSupported(false));
    } else {
      setArSupported(false);
    }
  }, []);

  const handleEnterAR = () => {
    if (arSupported) {
      xrStore.enterAR();
    }
  };

  return (
    <div className="w-full bg-[#121212] text-[#E5E7EB] h-14 flex items-center justify-between px-4 border-b border-[#2D2D2D]">
      <div className="flex items-center">
        <img src="/ADdition.svg" alt="Canvas Logo" className="w-6 h-6" />
        <img
          src="/textlogowhite.png"
          alt="ADdition"
          className="h-12 w-auto object-contain"
          style={{}}
        />
      </div>

      <div className="flex items-center gap-2">
        {/* AR Button */}
        <button
          onClick={handleEnterAR}
          disabled={arSupported === false}
          className="text-xs px-3 py-1 rounded-sm bg-[#10B981] text-white disabled:opacity-50 transition"
        >
          {arSupported === null
            ? "Checking AR…"
            : arSupported
            ? "Enter AR"
            : "AR Not Supported"}
        </button>

        {/* Your existing Publish button */}
        <button className="text-xs px-3 py-1 rounded-sm bg-[#6366F1] text-white hover:bg-indigo-500 transition">
          Publish
        </button>
      </div>
    </div>
  );
}
