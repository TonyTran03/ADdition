import { useState } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, Edges, TransformControls } from "@react-three/drei";
import { DuckTruck } from "./component/DuckTruck.jsx";
import SidePanelToggle from "./component/SidePanelToggle.jsx";
import FlowEditor from "./component/FlowEdit.jsx";
import { Suzanne } from "./component/Suzanne.jsx";
import DepthAxis from "./component/Axis.jsx";
import CustomOrbitControls from "./component/grid/CustomOrbitControls.jsx";
import { editorState } from "./state/valtioStore";
import { useSnapshot } from "valtio";
import { Vector3, Plane } from "three";
import DraggableModel from "./component/DraggableModel.jsx";

export default function App() {
  const [activePanel, setActivePanel] = useState("blocks");
  const [selectedModelId, setSelectedModelId] = useState("ducktruck");
  const [axisVisibility, setAxisVisibility] = useState({
    x: true,
    y: true,
    z: true,
  });

  const snap = useSnapshot(editorState);

  const selectedId = snap.selectedId;
  const selectedModel = selectedId ? snap.models[selectedId] : null;

  // Handlers to update transform
  const updatePosition = (axis, value) => {
    if (!selectedId) return;
    const pos = [...selectedModel.position];
    pos[axis] = parseFloat(value);
    editorState.updatePosition(pos);
  };

  const updateRotation = (axis, value) => {
    if (!selectedId) return;
    editorState.updateRotation(axis, parseFloat(value));
  };

  const updateScale = (value) => {
    if (!selectedId) return;
    editorState.updateScale(parseFloat(value));
  };
  const addModel = () => {
    editorState.addModel(selectedModelId);
  };

  const models = [
    { id: "ducktruck", label: "Duck Truck", Component: DuckTruck },
    { id: "suzanne", label: "Monkey Head", Component: Suzanne },
  ];

  return (
    <div className="w-full h-screen flex bg-[#1E1E1E] text-[#E5E7EB] font-sans text-sm">
      {/* Left Panel */}
      <div className="flex flex-col flex-[1_1_20%] bg-[#2A2A2A] border-r border-[#3D3D3D]">
        <SidePanelToggle
          activePanel={activePanel}
          onPanelChange={setActivePanel}
        />
        <div className="flex-1 p-4 overflow-auto">
          {activePanel === "blocks" && (
            <div className="space-y-2">
              <div
                className="cursor-pointer p-2 bg-[#1E1E1E] border border-[#3D3D3D] rounded-sm hover:bg-[#2A2A2A] transition"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "application/reactflow",
                    "I lay in my bed"
                  )
                }
              >
                On Click
              </div>
              <div
                className="cursor-pointer p-2 bg-[#1E1E1E] border border-[#3D3D3D] rounded-sm hover:bg-[#2A2A2A] transition"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "application/reactflow",
                    "cry myself to sleep"
                  )
                }
              >
                Show Text
              </div>
            </div>
          )}
          {activePanel === "assets" && (
            <div className="bg-[#1E1E1E] h-full p-2 rounded">Assets Panel</div>
          )}
        </div>
      </div>

      {/* FlowEditor Panel */}
      <div className="flex-[1_1_20%] bg-[#2A2A2A] border-r border-[#3D3D3D] p-4">
        <div className="w-full text-center text-sm font-medium text-[#E5E7EB] mb-3">
          Code Area
        </div>
        <FlowEditor />
      </div>

      {/* 3D Canvas */}
      <div className="h-screen w-full flex flex-col bg-[#1E1E1E] border-r border-[#3D3D3D]">
        <div className="p-4 border-b border-[#3D3D3D] bg-[#2A2A2A] flex items-center gap-4">
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="bg-[#1E1E1E] text-[#E5E7EB] border border-[#3D3D3D] rounded-sm px-2 py-1"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <button
            onClick={addModel}
            className="bg-[#6366F1] text-white px-3 py-1 rounded-sm hover:bg-indigo-500 transition"
          >
            + Add Model
          </button>
        </div>

        <div className="flex-1 relative">
          <Canvas
            className="w-full h-full"
            camera={{ position: [0, 0, 36], fov: 60 }}
            shadows
          >
            {/* Wrap all scene nodes in one group */}
            <group key="scene">
              <gridHelper
                args={[32, 16, "#444", "#888"]}
                rotation={[0, 0, 0]}
              />
              <DepthAxis
                length={16}
                color="white"
                visibility={axisVisibility}
              />
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
              />
              {/* <SnapPlane gridSize={1} /> */}
              <Environment preset="sunset" />
              <CustomOrbitControls />

              {Object.values(snap.models).map(({ id, type, position }) => (
                <DraggableModel
                  key={id}
                  id={id}
                  type={type}
                  position={position}
                />
              ))}
            </group>
          </Canvas>
        </div>
      </div>
      <div className="flex flex-col flex-[1_1_20%] bg-[#2A2A2A] border-l border-[#3D3D3D]">
        {/* Transform Panel */}
        <div className="p-4 border-b border-[#3D3D3D] space-y-4">
          <h3 className="text-sm font-medium">Transform</h3>

          {/* Position */}
          <div className="space-y-1">
            <p className="text-xs text-[#9CA3AF]">Position</p>
            <div className="space-y-1">
              {["X", "Y", "Z"].map((axis, i) => (
                <div key={`pos-${axis}`} className="flex items-center gap-2">
                  <span className="w-4 text-center text-[#9CA3AF]">{axis}</span>
                  <input
                    type="number"
                    value={selectedModel?.position?.[i] ?? 0}
                    onChange={(e) => updatePosition(i, e.target.value)}
                    className="flex-1 bg-[#1E1E1E] border border-[#3D3D3D] rounded text-sm px-2 py-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rotation */}
          <div className="space-y-1">
            <p className="text-xs text-[#9CA3AF]">Rotation</p>
            <div className="space-y-1">
              {["X", "Y", "Z"].map((axis, i) => (
                <div key={`rot-${axis}`} className="flex items-center gap-2">
                  <span className="w-4 text-center text-[#9CA3AF]">{axis}</span>
                  <input
                    type="number"
                    value={selectedModel?.rotation?.[i] ?? 0}
                    onChange={(e) => updateRotation(i, e.target.value)}
                    className="flex-1 bg-[#1E1E1E] border border-[#3D3D3D] rounded text-sm px-2 py-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Uniform Scale */}
          <div className="space-y-1">
            <p className="text-xs text-[#9CA3AF]">Scale</p>
            <input
              type="number"
              step="0.1"
              value={selectedModel?.scale ?? 1}
              onChange={(e) => updateScale(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#3D3D3D] rounded text-sm px-2 py-1"
            />
          </div>
        </div>

        {/* Axis Visibility - Pinned at Bottom */}
        <div className="p-4 border-t border-[#3D3D3D] space-y-2 text-xs">
          <p className="font-medium mb-1">Axis Visibility</p>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={axisVisibility.x}
              onChange={(e) =>
                setAxisVisibility((v) => ({ ...v, x: e.target.checked }))
              }
              className="toggle toggle-error"
            />
            Show X Axis
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={axisVisibility.y}
              onChange={(e) =>
                setAxisVisibility((v) => ({ ...v, y: e.target.checked }))
              }
              className="toggle toggle-success"
            />
            Show Y Axis
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={axisVisibility.z}
              onChange={(e) =>
                setAxisVisibility((v) => ({ ...v, z: e.target.checked }))
              }
              className="toggle toggle-info"
            />
            Show Z Axis
          </label>
        </div>
      </div>
    </div>
  );
}
