import { useState, useRef, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useThree, Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  TransformControls,
  ContactShadows,
  useGLTF,
  useCursor,
  Environment,
} from "@react-three/drei";
import { DuckTruck } from "./component/DuckTruck.jsx";
import SidePanelToggle from "./component/SidePanelToggle.jsx";
import FlowEditor from "./component/FlowEdit.jsx";

function App() {


  
  const ducktruckRef = useRef();
    const [activePanel, setActivePanel] = useState("blocks"); // default panel
  return (
    <>
{/* 
      <Canvas className="w-full h-full" camera={{ position: [0, 0, 5], fov: 75 }} shadows >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <Environment preset="sunset" />
        <OrbitControls />
        <TransformControls mode="translate">
          <DuckTruck ref={ducktruckRef} scale={0.5} />
        </TransformControls>
      </Canvas>
      */}


<div className="w-full h-screen flex">
  {/* Left Panel */}
  <div className="flex flex-col flex-[1_1_20%] bg-gray-100">
    {/* Toggle Buttons */}
    <SidePanelToggle activePanel={activePanel} onPanelChange={setActivePanel} />

    {/* Panel Content */}
    <div className="flex-1 p-4 overflow-auto text-amber-800">
      {activePanel === "blocks" && (
        <div className="h-[500px]">

          <div
  className="cursor-pointer p-2 mb-2 bg-white border rounded shadow"
  draggable
  onDragStart={(event) =>
    event.dataTransfer.setData('application/reactflow', 'On Click')
  }
>
  On Click
</div>

<div
  className="cursor-pointer p-2 mb-2 bg-white border rounded shadow"
  draggable
  onDragStart={(event) =>
    event.dataTransfer.setData('application/reactflow', 'Show Text')
  }
>
  Show Text
</div>
         
        </div>
      )}
      {activePanel === "assets" && (
        <div className="bg-gray-200 h-full">Assets Panel</div>
      )}
    </div>

  </div>

  {/* second */}
  <div className="bg-green-200 flex-[1_1_20%] text-black">Canvas

 <FlowEditor />

  </div>

  {/* third */}
  <div className="bg-blue-200 flex-[2_2_40%]">Bottom Left</div>

  {/* fourth */}
  <div className="bg-yellow-200 flex-[1_1_20%]">Bottom Right</div>
</div>

    </>
  );
}

export default App;
