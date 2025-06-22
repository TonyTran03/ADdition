import { useState, useEffect, useRef } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  TransformControls,
  PointerLockControls,
} from "@react-three/drei";
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
import modelList from "./assets/models.json";
import { Pencil } from "lucide-react";
import NavBar from "./component/NavBar"; // Adjust path if needed
import FirstPersonController from "./component/FirstPersonController.jsx";

export default function App() {
  const [immersiveMode, setImmersiveMode] = useState(false);
  const canvasRef = useRef();

  const [activePanel, setActivePanel] = useState("blocks");
  const [selectedModelId, setSelectedModelId] = useState("ducktruck");
  const [axisVisibility, setAxisVisibility] = useState({
    x: true,
    y: true,
    z: true,
  });
  const [modalName, setModalName] = useState("");

  const snap = useSnapshot(editorState);

  const selectedId = snap.selectedId;
  const selectedModel = selectedId ? snap.models[selectedId] : null;

  const updatePosition = (axis, value) => {
    if (!selectedId) return;
    const pos = [...selectedModel.position];
    let newVal = parseFloat(value);

    // Cap X and Z values to max ±16
    if ((axis === 0 || axis === 2) && !isNaN(newVal)) {
      newVal = Math.max(Math.min(newVal, 16), -16); // Cap between -16 and 16
    }

    pos[axis] = newVal;
    editorState.updatePosition(pos);
  };
  const updateRotation = (axis, value) => {
    if (!selectedId) return;

    let degrees = parseFloat(value);
    // Wrap around to 0–360
    degrees = ((degrees % 360) + 360) % 360;

    const radians = (degrees * Math.PI) / 180;
    editorState.updateRotation(axis, radians);
  };

  const updateScale = (value) => {
    if (!selectedId) return;
    editorState.updateScale(parseFloat(value));
  };

  useEffect(() => {
    if (selectedModel?.name) {
      setModalName(selectedModel.name);
    }
  }, [selectedModel?.id]);

  useEffect(() => {
    const handleExit = () => {
      if (!document.pointerLockElement) {
        setImmersiveMode(false);

        // 🔁 Reset camera when exiting immersive
        const canvas = canvasRef.current;
        if (canvas?.__r3f?.root) {
          const camera = canvas.__r3f.root.getState().camera;
          camera.position.set(0, 0, 36);
          camera.rotation.set(0, 0, 0); // Optional: face forward
        }
      }
    };
    document.addEventListener("pointerlockchange", handleExit);
    return () => document.removeEventListener("pointerlockchange", handleExit);
  }, []);

  return (
    <>
      <NavBar
        onEnterPointerLock={() => {
          canvasRef.current?.requestPointerLock();
          setImmersiveMode(true);

          // Move camera just above the grid
          const canvas = canvasRef.current;
          if (canvas && canvas.__r3f && canvas.__r3f.root) {
            const camera = canvas.__r3f.root.getState().camera;
            camera.position.set(0, 1.5, 0); // 1.5 units tall, center of grid
            camera.rotation.set(0, 0, 0);
          }
        }}
      />
      <div className="w-full h-screen flex bg-[#1E1E1E] text-[#E5E7EB] font-sans text-sm">
        {/* Left Panel 1 */}
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
              <div className="bg-[#1E1E1E] h-full p-2 rounded">Gemini</div>
            )}
          </div>
        </div>

        {/* FlowEditor Panel 2 */}
        <div className="flex-[1_1_30%] lg:flex-[1_1_20%] bg-[#2A2A2A] border-r border-[#3D3D3D] p-4">
          <div className="w-full text-center text-sm font-medium text-[#E5E7EB] mb-3">
            Code Area
          </div>
          <FlowEditor />
        </div>

        {/* 3D Canvas  3*/}
        <div className="h-screen flex flex-col flex-[1_1_60%] lg:flex-[1_1_auto] bg-[#1E1E1E] border-r border-[#3D3D3D]">
          <div className="p-4 border-b border-[#3D3D3D] bg-[#2A2A2A] overflow-y-auto max-h-48">
            <div className="flex flex-wrap gap-2">
              {Object.values(snap.models).map(({ id, type }) => {
                const assetInfo = modelList.find((m) => m.id === type);
                return (
                  <div
                    key={id}
                    onClick={() => editorState.selectModel(id)}
                    className={`cursor-pointer flex flex-col items-center border rounded p-1 transition ${
                      snap.selectedId === id
                        ? "border-[#6366F1] bg-[#1E1E1E]"
                        : "border-[#3D3D3D]"
                    }`}
                  >
                    <img
                      src={assetInfo?.thumbnail}
                      alt={type}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="text-xs text-white truncate max-w-[5rem]">
                      {snap.models[id]?.name || assetInfo?.label}
                    </span>
                  </div>
                );
              })}

              {/* Add Button - Always at the End */}
              <label
                htmlFor="asset-picker-modal"
                className="flex flex-col items-center justify-center w-10 h-10 border border-dashed border-[#6366F1] text-[#6366F1] hover:bg-[#1E1E1E] rounded cursor-pointer"
              >
                +
              </label>
            </div>
          </div>

          <div className="flex-1 relative">
            <Canvas
              ref={canvasRef}
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
                {immersiveMode ? (
                  <>
                    <PointerLockControls />
                    <FirstPersonController active={true} />
                  </>
                ) : (
                  <CustomOrbitControls />
                )}
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

            {/* Rename Button */}
            {selectedModel && (
              <div className="space-y-1">
                <p className="text-xs text-[#9CA3AF]">Name</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm truncate">
                    {selectedModel.name || "Untitled"}
                  </span>
                  <label
                    htmlFor="rename-model-modal"
                    className="cursor-pointer text-[#9CA3AF] hover:text-white"
                    title="Rename"
                  >
                    <Pencil size={14} />
                  </label>
                </div>
              </div>
            )}

            {/* Position */}
            <div className="space-y-1">
              <p className="text-xs text-[#9CA3AF]">Position</p>
              <div className="space-y-1">
                {["X", "Y", "Z"].map((axis, i) => (
                  <div key={`pos-${axis}`} className="flex items-center gap-2">
                    <span className="w-4 text-center text-[#9CA3AF]">
                      {axis}
                    </span>
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
                    <span className="w-4 text-center text-[#9CA3AF]">
                      {axis}
                    </span>
                    <input
                      type="number"
                      value={
                        selectedModel?.rotation?.[i]
                          ? (
                              (selectedModel.rotation[i] * 180) /
                              Math.PI
                            ).toFixed(2)
                          : 0
                      }
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
        <input
          type="checkbox"
          id="asset-picker-modal"
          className="modal-toggle"
        />
        <div className="modal z-50">
          <div className="modal-box max-w-2xl bg-[#2A2A2A]">
            <h3 className="font-bold text-lg text-white mb-4">
              Choose an Asset
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {modelList.map((asset) => (
                <div
                  key={asset.id}
                  className="cursor-pointer bg-[#1E1E1E] hover:bg-[#333] p-3 rounded flex flex-col items-center"
                  onClick={() => {
                    editorState.addModel(asset.id);
                    document.getElementById(
                      "asset-picker-modal"
                    ).checked = false;
                  }}
                >
                  <img
                    src={asset.thumbnail}
                    alt={asset.label}
                    className="w-16 h-16 object-cover rounded mb-1"
                  />
                  <span className="text-xs text-white">{asset.label}</span>
                </div>
              ))}
            </div>
            <div className="modal-action">
              <label htmlFor="asset-picker-modal" className="btn">
                Close
              </label>
            </div>
          </div>
        </div>

        <input
          type="checkbox"
          id="rename-model-modal"
          className="modal-toggle"
        />
        <div className="modal z-50">
          <div className="modal-box bg-[#2A2A2A]">
            <h3 className="font-bold text-lg text-white mb-4">Rename Model</h3>
            <input
              type="text"
              className="w-full bg-[#1E1E1E] border border-[#3D3D3D] rounded px-2 py-1 text-sm text-white"
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
            />
            <div className="modal-action">
              <label
                htmlFor="rename-model-modal"
                className="btn"
                onClick={() => {
                  if (selectedModel && modalName.trim()) {
                    editorState.renameModel(modalName.trim());
                  }
                }}
              >
                Confirm
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
