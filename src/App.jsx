import { useState, useRef } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, Edges } from "@react-three/drei";
import { DuckTruck } from "./component/DuckTruck.jsx";
import SidePanelToggle from "./component/SidePanelToggle.jsx";
import FlowEditor from "./component/FlowEdit.jsx";
import { Suzanne } from "./component/Suzanne.jsx";
import DepthAxis from "./component/Axis.jsx";
import SnapPlane from "./component/grid/SnapPlane.jsx";
import CustomOrbitControls from "./component/grid/CustomOrbitControls.jsx";
import { editorState } from "./state/valtioStore"; // Adjust path
import { useSnapshot } from "valtio";
function App() {
  const [activePanel, setActivePanel] = useState("blocks"); // default panel
  const [selectedModelId, setSelectedModelId] = useState("ducktruck");

  const snap = useSnapshot(editorState);
  //  {creating a new model instance in real-time}
  const addModel = () => {
    editorState.addModel(selectedModelId);
  };

  const models = [
    { id: "ducktruck", label: "Duck Truck", Component: DuckTruck },
    { id: "suzanne", label: "Monkey Head", Component: Suzanne },
  ];

  return (
    <>
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
                    e.dataTransfer.setData("application/reactflow", "On Click")
                  }
                >
                  On Click
                </div>
                <div
                  className="cursor-pointer p-2 bg-[#1E1E1E] border border-[#3D3D3D] rounded-sm hover:bg-[#2A2A2A] transition"
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("application/reactflow", "Show Text")
                  }
                >
                  Show Text
                </div>
              </div>
            )}
            {activePanel === "assets" && (
              <div className="bg-[#1E1E1E] h-full p-2 rounded">Chat Bot</div>
            )}
          </div>
        </div>

        {/* second */}
        <div className="flex-[1_1_20%] bg-[#2A2A2A] border-r border-[#3D3D3D] p-4">
          <div className="w-full text-center text-sm font-medium text-[#E5E7EB] mb-3">
            Code Area
          </div>
          <FlowEditor />
        </div>

        {/* third */}
        <div className="h-screen w-full flex flex-col bg-[#1E1E1E] border-r border-[#3D3D3D]">
          <div className="p-4 border-b border-[#3D3D3D] bg-[#2A2A2A] flex items-center gap-4">
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="bg-[#1E1E1E] text-[#E5E7EB] border border-[#3D3D3D] rounded-sm px-2 py-1"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.label}
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
              camera={{ position: [0, 0, 16], fov: 60 }}
              shadows
            >
              {/* Grid Floor */}
              <gridHelper
                args={[32, 16, "#444", "#888"]} // 32 units wide, 16 divisions
                position={[0, 0, 0]}
                rotation={[-Math.PI / 1.7, 0, 0]} // Tilted ~36° instead of full flat
              />
              <DepthAxis length={16} color="white" />
              {/* Lighting */}
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
              />
              <SnapPlane gridSize={1} />
              {/* Environment & Controls */}
              <Environment preset="sunset" />
              <CustomOrbitControls />

              {Object.values(snap.models).map(({ id, type, position }) => {
                const def = models.find((m) => m.id === type);
                if (!def) return null;
                return (
                  <group
                    key={id}
                    name={id}
                    position={position}
                    onClick={(e) => {
                      e.stopPropagation();
                      editorState.selectModel(id);
                      console.log("👉 selected model:", editorState.models[id]);
                    }}
                  >
                    <def.Component scale={0.5} />
                    {snap.selectedId === id && <Edges scale={1} />}
                  </group>
                );
              })}
            </Canvas>
          </div>
        </div>

        {/* fourth */}
        <div className="flex-[1_1_20%] bg-[#2A2A2A] p-4 border-l border-[#3D3D3D]">
          Bottom Right
        </div>
      </div>
    </>
  );
}

export default App;
