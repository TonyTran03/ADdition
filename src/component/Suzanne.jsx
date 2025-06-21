import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Suzanne(props) {
  const { nodes, materials } = useGLTF("/suzanne.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Suzanne.geometry}
        material={nodes.Suzanne.material}
        position={[0, 0.189, -0.043]}
      />
    </group>
  );
}

useGLTF.preload("/suzanne.gltf");
