import { useState } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, Edges, TransformControls } from "@react-three/drei";
import { DuckTruck } from "./component/DuckTruck.jsx";
import SidePanelToggle from "./component/SidePanelToggle.jsx";
import FlowEditor from "./component/FlowEdit.jsx";
import { Suzanne } from "./component/Suzanne.jsx";
import DepthAxis from "./component/Axis.jsx";
import SnapPlane from "./component/grid/SnapPlane.jsx";
import CustomOrbitControls from "./component/grid/CustomOrbitControls.jsx";
import { editorState } from "./state/valtioStore";
import { useSnapshot } from "valtio";
import { Vector3, Plane } from "three";
import DraggableModel from "./component/DraggableModel.jsx";

export default function App() {
  const [activePanel, setActivePanel] = useState("blocks");
  const [selectedModelId, setSelectedModelId] = useState("ducktruck");
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
            camera={{ position: [-1, -4, 36], fov: 60 }}
            shadows
          >
            {/* Wrap all scene nodes in one group */}
            <group key="scene">
              <gridHelper
                args={[32, 16, "#444", "#888"]}
                rotation={[-Math.PI / 1.7, 0, 0]}
              />
              <DepthAxis length={16} color="white" />
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

      {/* Properties Panel */}
      <div className="flex-[1_1_20%] bg-[#2A2A2A] p-4 border-l border-[#3D3D3D]">
        <h3 className="text-sm font-medium mb-2">Properties</h3>
        {!selectedModel && <p className="text-xs">Select a model to edit.</p>}
        {selectedModel && (
          <div className="space-y-2 text-xs">
            <div>
              <label className="block">Position X:</label>
              <input
                type="number"
                value={selectedModel.position[0]}
                onChange={(e) => updatePosition(0, e.target.value)}
                className="w-full bg-[#1E1E1E] border border-[#3D3D3D] p-1 rounded text-sm"
              />
            </div>
            <div>
              <label className="block">Position Y:</label>
              <input
                type="number"
                value={selectedModel.position[1]}
                onChange={(e) => updatePosition(1, e.target.value)}
                className="w-full bg-[#1E1E1E] border border-[#3D3D3D] p-1 rounded text-sm"
              />
            </div>
            <div>
              <label className="block">Position Z:</label>
              <input
                type="number"
                value={selectedModel.position[2]}
                onChange={(e) => updatePosition(2, e.target.value)}
                className="w-full bg-[#1E1E1E] border border-[#3D3D3D] p-1 rounded text-sm"
              />
            </div>
            <div>
              <label className="block">Rotation X:</label>
              <input
                type="number"
                value={selectedModel.rotation ? selectedModel.rotation[0] : 0}
                onChange={(e) => updateRotation(0, e.target.value)}
                className="w-full bg-[#1E1E1E] border border-[#3D3D3D] p-1 rounded text-sm"
              />
            </div>
            <div>
              <label className="block">Rotation Y:</label>
              <input
                type="number"
                value={selectedModel.rotation ? selectedModel.rotation[1] : 0}
                onChange={(e) => updateRotation(1, e.target.value)}
                className="w-full bg-[#1E1E1E] border border-[#3D3D3D] p-1 rounded text-sm"
              />
            </div>
            <div>
              <label className="block">Rotation Z:</label>
              <input
                type="number"
                value={selectedModel.rotation ? selectedModel.rotation[2] : 0}
                onChange={(e) => updateRotation(2, e.target.value)}
                className="w-full bg-[#1E1E1E] border border-[#3D3D3D] p-1 rounded text-sm"
              />
            </div>
            <div>
              <label className="block">Scale:</label>
              <input
                type="number"
                step="0.1"
                value={selectedModel.scale ?? 1}
                onChange={(e) => updateScale(e.target.value)}
                className="w-full bg-[#1E1E1E] border border-[#3D3D3D] p-1 rounded text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
