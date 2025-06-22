import React, { useRef, useState } from "react";
import { Vector3, Plane } from "three";
import { useSnapshot } from "valtio";
import { Html, useGLTF } from "@react-three/drei";
import { editorState } from "../state/valtioStore";
import { Select } from "@react-three/postprocessing";
import modelList from "../assets/models.json";
import confetti from "canvas-confetti";
import { useFrame, useThree } from "@react-three/fiber";

function parseBlockLogic(blocks) {
  const [event, ...actions] = blocks;
  return { event, actions };
}
export default function DraggableModel({
  id,
  type,
  position,
  orbitRef,
  gridSize = 1,
}) {
  const { camera } = useThree();
  const hasTriggeredProximity = useRef(false);
  const snap = useSnapshot(editorState);
  const groupRef = useRef();
  const dragPlane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const dragOffset = useRef(new Vector3());
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const model = snap.models[id];
  const metadata = model.metadata;
  const rotation = model?.rotation || [0, 0, 0];
  const scale = model?.scale || 1;

  const meta = modelList.find((m) => m.id === type);
  const { scene } = useGLTF(meta?.glb || "");
  const eventBlocks = model.metadata?.blocks || [];

  const runOnClick = () => {
    const { event, actions } = parseBlockLogic(eventBlocks);
    if (event?.data?.type !== "onClick") return;

    actions.forEach((a) => {
      switch (a.data?.type) {
        case "showDiscount":
          console.log("🛒 Showing discount:", a.data.percentage);
          break;

        case "animation":
          groupRef.current?.scale.set(1.2, 1.2, 1.2);
          setTimeout(() => groupRef.current?.scale.set(1, 1, 1), 300);
          break;

        case "hideObject":
          if (groupRef.current) {
            groupRef.current.visible = false;
            console.log("🙈 Object hidden");
          }
          break;

        case "partyMode":
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          break;

        default:
          console.warn("Unhandled block:", a);
      }
    });
  };

  useFrame(() => {
    if (!groupRef.current || hasTriggeredProximity.current) return;

    const distance = camera.position.distanceTo(groupRef.current.position);
    if (distance < 2.5) {
      const { event, actions } = parseBlockLogic(eventBlocks);
      if (event?.data?.type === "onProximity") {
        hasTriggeredProximity.current = true; // avoid repeated triggers
        actions.forEach((a) => {
          switch (a.data?.type) {
            case "partyMode":
              confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
              break;
            case "animation":
              groupRef.current?.scale.set(1.5, 1.5, 1.5);
              setTimeout(() => groupRef.current?.scale.set(1, 1, 1), 400);
              break;
            case "hideObject":
              groupRef.current.visible = false;
              break;
            default:
              console.warn("Unhandled proximity action:", a);
          }
        });
      }
    }
  });
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
    runOnClick();
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
  const runOnHover = () => {
    const { event, actions } = parseBlockLogic(eventBlocks);
    if (event?.data?.type !== "onHover") return;

    actions.forEach((a) => {
      switch (a.data?.type) {
        case "showDiscount":
          console.log("✨ Hover discount:", a.data.percentage);
          break;
        case "animation":
          groupRef.current?.scale.set(1.1, 1.1, 1.1);
          setTimeout(() => groupRef.current?.scale.set(1, 1, 1), 300);
          break;
        case "hideObject":
          groupRef.current.visible = false;
          break;
        case "partyMode":
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          break;
        default:
          console.warn("Unhandled hover action:", a);
      }
    });
  };
  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerMove={onPointerMove}
      onPointerEnter={() => {
        setHovered(true);
        runOnHover();
      }}
      onPointerLeave={() => setHovered(false)}
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
