import React, { useRef, useState } from "react";
import { Vector3, Plane } from "three";
import { useSnapshot } from "valtio";
import { Edges } from "@react-three/drei";
import { editorState } from "../state/valtioStore";
import { DuckTruck } from "../component/DuckTruck.jsx";
import { Suzanne } from "../component/Suzanne.jsx";
import { Select } from "@react-three/postprocessing";
const modelMap = {
  ducktruck: DuckTruck,
  suzanne: Suzanne,
};

export default function DraggableModel({
  id,
  type,
  position,
  orbitRef,
  gridSize = 1,
}) {
  const snap = useSnapshot(editorState);
  const Component = modelMap[type];

  const groupRef = useRef();
  const dragPlane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const dragOffset = useRef(new Vector3());
  const [dragging, setDragging] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    // PICK UP
    if (!dragging) {
      setDragging(true);
      // disable orbit
      if (orbitRef?.current) orbitRef.current.enabled = false;
      // align plane to object's height
      dragPlane.current.setFromNormalAndCoplanarPoint(
        new Vector3(0, 1, 0),
        groupRef.current.getWorldPosition(new Vector3())
      );
      // compute offset
      const intersect = e.ray.intersectPlane(dragPlane.current, new Vector3());
      if (intersect) {
        dragOffset.current
          .copy(intersect)
          .sub(groupRef.current.getWorldPosition(new Vector3()));
      }
      editorState.selectModel(id);
    } else {
      // DROP
      const intersect = e.ray.intersectPlane(dragPlane.current, new Vector3());
      if (intersect) {
        // compute new world position minus offset
        const worldPos = intersect.sub(dragOffset.current);
        // convert to local
        const localPos = groupRef.current.parent.worldToLocal(worldPos.clone());
        // Snap X and Z to grid
        const snappedX = Math.round(localPos.x / gridSize) * gridSize;
        const snappedZ = Math.round(localPos.z / gridSize) * gridSize;

        // Stack logic: find how many models occupy this X/Z pair
        let stackHeight = 0;
        Object.values(snap.models).forEach((model) => {
          if (
            model.id !== id && // don't compare with self
            Math.round(model.position[0] / gridSize) * gridSize === snappedX &&
            Math.round(model.position[2] / gridSize) * gridSize === snappedZ
          ) {
            stackHeight = Math.max(stackHeight, model.position[1] + 1);
          }
        });

        // Final snapped position with stackHeight on Y
        const snapped = [snappedX, stackHeight, snappedZ];
        groupRef.current.position.set(...snapped);
        editorState.updatePosition(snapped);
        groupRef.current.position.set(...snapped);
        editorState.updatePosition(snapped);
      }
      setDragging(false);
      // re-enable orbit
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
      onClick={handleClick}
      onPointerMove={onPointerMove}
    >
      <Select enabled={snap.selectedId === id}>
        {Component && <Component scale={0.5} />}
      </Select>
    </group>
  );
}
