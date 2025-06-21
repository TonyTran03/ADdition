import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { editorState } from "../../state/valtioStore";

export default function SnapPlane({ gridSize = 1 }) {
  const { camera, gl, raycaster, scene } = useThree();
  const planeRef = useRef();
  const mouse = useRef(new THREE.Vector2());
  const snap = useSnapshot(editorState);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerDown = (e) => {
      if (snap.current) setDragging(true);
    };

    const handlePointerUp = () => {
      setDragging(false);
    };

    const handlePointerMove = (event) => {
      if (!dragging || !snap.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse.current, camera);
      const intersects = raycaster.intersectObject(planeRef.current);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const snapped = [
          Math.round(point.x / gridSize) * gridSize,
          0.01,
          Math.round(point.z / gridSize) * gridSize,
        ];

        // 👇 Match the placed model and update its position in React state
        setPlacedModels((prevModels) =>
          prevModels.map((model) =>
            `model-${model.id}` === snap.current
              ? { ...model, position: snapped }
              : model
          )
        );
      }
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
    };
  }, [camera, gl, raycaster, scene, snap.current, gridSize, dragging]);

  return (
    <mesh
      ref={planeRef}
      rotation={[-Math.PI / 1.7, 0, 0]}
      position={[0, 0.01, 0]}
      name="snapPlane"
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}
