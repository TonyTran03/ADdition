import React, { useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSnapshot } from "valtio";
import { editorState } from "../state/valtioStore";

const initialNodes = [];
const initialEdges = [];

function FlowEditorContent() {
  const snap = useSnapshot(editorState);

  useEffect(() => {
    if (snap.selectedId && snap.models[snap.selectedId]) {
      const blocks = snap.models[snap.selectedId].metadata.blocks;
      setNodes(blocks || []);
      setEdges([]); // optionally reset edges per model
    }
  }, [snap.selectedId]);
  const wrapperRef = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !wrapperRef.current) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const centerOffset = { x: 75, y: 20 };
      const position = project({
        x: event.clientX - bounds.left - centerOffset.x,
        y: event.clientY - bounds.top - centerOffset.y,
      });
      const raw = event.dataTransfer.getData("application/reactflow");
      const block = JSON.parse(raw);
      const id = `${block.id}-${Date.now()}`;
      const newNode = {
        id,
        type: "default",
        position,
        data: { label: block.label },
      };

      setNodes((nds) => nds.concat(newNode));

      // Add node to selected model's metadata.blocks
      editorState.addBlockToModel(newNode);
    },
    [project, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div ref={wrapperRef} className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{ width: "100%", height: "100%" }}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={false}
        elementsSelectable={false}
        autoPanOnNodeDrag={false}
        zoomOnDoubleClick={false}
      >
        <Background />
      </ReactFlow>

      {/*  message if no blocks */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-[#9CA3AF] pointer-events-none">
          Place a block here to start dragging
        </div>
      )}
    </div>
  );
}

export default function FlowEditor() {
  return (
    <ReactFlowProvider>
      <FlowEditorContent />
    </ReactFlowProvider>
  );
}
