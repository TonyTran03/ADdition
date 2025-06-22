import { useState } from "react";
import { Handle } from "reactflow";

export default function CustomNode({ data, id }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(data.percentage || "");

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-[#1E1E1E] text-white p-2 rounded border border-[#3D3D3D] text-xs cursor-pointer"
      >
        {data.label}
        {data.percentage && (
          <div className="text-[10px]">{data.percentage}</div>
        )}

        <Handle
          type="source"
          position="right"
          style={{ background: "#6366F1" }}
        />
        <Handle
          type="target"
          position="left"
          style={{ background: "#6366F1" }}
        />
      </div>

      {open && (
        <div className="modal modal-open">
          <div className="modal-box bg-[#2A2A2A] text-white">
            <h3 className="font-bold text-lg">Edit Discount</h3>
            <input
              className="input input-bordered w-full bg-[#1E1E1E] border-[#3D3D3D] text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => {
                  data.percentage = input; // <-- quick update
                  setOpen(false);
                }}
              >
                Save
              </button>
              <button className="btn" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
