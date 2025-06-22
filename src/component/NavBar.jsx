export default function NavBar() {
  return (
    <div className="w-full bg-[#121212] text-[#E5E7EB] h-14 flex items-center justify-between px-4 border-b border-[#2D2D2D]">
      <div className="flex items-center">
        <img src="/ADdition.svg" alt="Canvas Logo" className="w-6 h-6" />
        <img
          src="/textlogowhite.png"
          alt="ADdition"
          className="h-12 w-auto object-contain"
          style={{ marginLeft: "-0.5cm", marginbot: "2cm" }}
        />
      </div>
      <button className="text-xs px-3 py-1 rounded-sm bg-[#6366F1] text-white hover:bg-indigo-500 transition">
        Publish
      </button>
    </div>
  );
}
