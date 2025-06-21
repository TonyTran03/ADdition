import * as THREE from "three";
import { Text } from "@react-three/drei";

export default function DepthAxis({ length = 16, color = "white" }) {
  return (
    <group>
      {/* Z Axis Line (centered, going "into" screen) */}
      <line>
        <bufferGeometry
          attach="geometry"
          attributes={{
            position: new THREE.Float32BufferAttribute(
              [0, 0.01, -length, 0, 0.01, length],
              3
            ),
          }}
        />
        <lineBasicMaterial attach="material" color={color} />
      </line>

      {/* Arrowhead Cone at far Z end */}
      <mesh position={[0, 0.01, length + 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Label */}
      <Text
        position={[0.4, 0.1, length + 0.5]}
        fontSize={0.5}
        color={color}
        anchorX="left"
        anchorY="middle"
      >
        Z
      </Text>
    </group>
  );
}
