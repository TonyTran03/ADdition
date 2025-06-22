import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function shoebox(props) {
  const { nodes, materials } = useGLTF("/shoe11ff4.glb");
  return (
    <group {...props} dispose={null}>
      <group scale={0.612}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.BezierCurve_1.geometry}
          material={materials["Material.006"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.BezierCurve_2.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.BezierCurve_3.geometry}
          material={materials["Material.005"]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004.geometry}
        material={nodes.Cube004.material}
        position={[0.008, 1.549, 0.798]}
        scale={[2.988, 1.768, 3.886]}
      />
      <group position={[0, 4.032, 0.817]} scale={[2.088, 0.648, 2.088]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder_1.geometry}
          material={materials["Material.008"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder_2.geometry}
          material={materials["Material.009"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder_3.geometry}
          material={materials["Material.007"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/shoe.glb");
