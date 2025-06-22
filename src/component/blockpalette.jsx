import rawBlocks from "./block.json";

// Fallback in case the JSON is wrapped under `default`
const blocks = rawBlocks.default || rawBlocks;
const { eventBlocks = [], actionBlocks = [] } = blocks;

export default function BlockPalette() {
  const createBlock = (block) => (
    <div
      key={block.id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/reactflow", JSON.stringify(block));
      }}
      className="bg-[#1E1E1E] text-white border border-[#3D3D3D] rounded px-3 py-1 text-sm mb-2 shadow cursor-pointer hover:bg-[#2A2A2A] transition flex items-center gap-2"
    >
      <span>{block.label}</span>
    </div>
  );

  return (
    <div>
      <h4 className="text-xs text-gray-400 uppercase mb-2">Event</h4>
      {eventBlocks.map(createBlock)}
      <h4 className="text-xs text-gray-400 uppercase mt-4 mb-2">Action</h4>
      {actionBlocks.map(createBlock)}
    </div>
  );
}
