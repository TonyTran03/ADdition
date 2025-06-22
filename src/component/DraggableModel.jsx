import React, { useRef, useState } from "react";
import { Vector3, Plane } from "three";
import { useSnapshot } from "valtio";
import { Html, useGLTF } from "@react-three/drei";
import { editorState } from "../state/valtioStore";
import { Select } from "@react-three/postprocessing";
import modelList from "../assets/models.json";

export default function DraggableModel({
  id,
  type,
  position,
  orbitRef,
  gridSize = 1,
}) {
  const snap = useSnapshot(editorState);
  const groupRef = useRef();
  const dragPlane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const dragOffset = useRef(new Vector3());
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const model = snap.models[id];
  const rotation = model?.rotation || [0, 0, 0];
  const scale = model?.scale || 1;

  const meta = modelList.find((m) => m.id === type);
  const { scene } = useGLTF(meta?.glb || "");

  const handleClick = (e) => {
    e.stopPropagation();
    if (!dragging) {
      setDragging(true);
      if (orbitRef?.current) orbitRef.current.enabled = false;

      dragPlane.current.setFromNormalAndCoplanarPoint(
        new Vector3(0, 1, 0),
        groupRef.current.getWorldPosition(new Vector3())
      );
      const intersect = e.ray.intersectPlane(dragPlane.current, new Vector3());
      if (intersect) {
        dragOffset.current
          .copy(intersect)
          .sub(groupRef.current.getWorldPosition(new Vector3()));
      }
      editorState.selectModel(id);
    } else {
      const intersect = e.ray.intersectPlane(dragPlane.current, new Vector3());
      if (intersect) {
        const worldPos = intersect.sub(dragOffset.current);
        const localPos = groupRef.current.parent.worldToLocal(worldPos.clone());

        const snappedX = Math.round(localPos.x / gridSize) * gridSize;
        const snappedZ = Math.round(localPos.z / gridSize) * gridSize;

        let stackHeight = 0;
        Object.values(snap.models).forEach((model) => {
          if (
            model.id !== id &&
            Math.round(model.position[0] / gridSize) * gridSize === snappedX &&
            Math.round(model.position[2] / gridSize) * gridSize === snappedZ
          ) {
            stackHeight = Math.max(stackHeight, model.position[1] + 1);
          }
        });

        const cappedX = Math.max(Math.min(snappedX, 16), -16);
        const cappedZ = Math.max(Math.min(snappedZ, 16), -16);
        const snapped = [cappedX, stackHeight, cappedZ];

        groupRef.current.position.set(...snapped);
        editorState.updatePosition(snapped);
      }
      setDragging(false);
      if (orbitRef?.current) orbitRef.current.enabled = true;
    }
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    e.stopPropagation();
    const intersect = e.ray.intersectPlane(dragPlane.current, new Vector3());
    if (intersect) {
      const worldPos = intersect.sub(dragOffset.current);
      const localPos = groupRef.current.parent.worldToLocal(worldPos.clone());
      groupRef.current.position.copy(localPos);
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerMove={onPointerMove}
    >
      <Select enabled={snap.selectedId === id}>
        <primitive object={scene} scale={scale} />
      </Select>

      {hovered && (
        <Html center distanceFactor={10}>
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded shadow">
            {model?.name || meta?.label || "Model"}
          </div>
        </Html>
      )}
    </group>
  );
}
