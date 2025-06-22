import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SPEED = 6;

export default function FirstPersonController({ active }) {
  const keys = useRef({});
  const velocity = useRef(new THREE.Vector3());
  const direction = new THREE.Vector3();
  const { camera } = useThree();
  useEffect(() => {
    if (active) {
      camera.position.set(0, 1.5, 0);
      camera.rotation.set(0, 0, 0);
    }
  }, [active]);
  useEffect(() => {
    const onKeyDown = (e) => (keys.current[e.key.toLowerCase()] = true);
    const onKeyUp = (e) => (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!active) return;

    direction.set(0, 0, 0);
    if (keys.current["w"]) direction.z -= 1;
    if (keys.current["s"]) direction.z += 1;
    if (keys.current["a"]) direction.x -= 1;
    if (keys.current["d"]) direction.x += 1;

    direction.normalize().applyEuler(camera.rotation);

    // Prevent vertical movement
    velocity.current.copy(direction).multiplyScalar(SPEED * delta);
    velocity.current.y = 0; // 🔒 lock Y movement

    camera.position.add(velocity.current);
  });

  return null;
}
