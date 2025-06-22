export default function NavBar({ onEnterPointerLock }) {
  return (
    <div className="w-full bg-[#121212] text-[#E5E7EB] h-14 flex items-center justify-between px-4 border-b border-[#2D2D2D]">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/ADdition.svg" alt="Canvas Logo" className="w-6 h-6" />
        <img
          src="/textlogowhite.png"
          alt="ADdition"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <div className="tooltip tooltip-bottom" data-tip="Press E to interact">
          <button
            onClick={onEnterPointerLock}
            className="text-xs px-3 py-1 rounded-sm bg-yellow-500 text-white hover:bg-yellow-600 transition"
          >
            Enter Immersive
          </button>
        </div>

        <button className="text-xs px-3 py-1 rounded-sm bg-[#6366F1] text-white hover:bg-indigo-500 transition">
          Publish
        </button>
      </div>
    </div>
  );
}
