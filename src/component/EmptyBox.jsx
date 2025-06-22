import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function EmptyBox(props) {
  const { nodes, materials } = useGLTF("/Empty Box.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Empty_box.geometry}
        material={materials.Material}
        scale={100}
      />
    </group>
  );
}

useGLTF.preload("/Empty Box.glb");
