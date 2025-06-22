export default function NavBar() {
  return (
    <div className="w-full bg-[#121212] text-[#E5E7EB] h-15 flex items-center justify-between px-4 border-b border-[#2D2D2D]">
      <div className="text-sm font-semibold tracking-wide">Cantvas</div>
      <button className="text-xs px-3 py-1 rounded-sm bg-[#6366F1] text-white hover:bg-indigo-500 transition">
        Publish
      </button>
    </div>
  );
}
