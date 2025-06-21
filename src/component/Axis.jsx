import * as THREE from "three";
import { Text } from "@react-three/drei";

export default function DepthAxis({ length = 16, color = "white" }) {
  return (
    <group>
      {/* X Axis */}
      <line>
        <bufferGeometry
          attach="geometry"
          attributes={{
            position: new THREE.Float32BufferAttribute(
              [-length, 0.01, 0, length, 0.01, 0],
              3
            ),
          }}
        />
        <lineBasicMaterial attach="material" color="red" />
      </line>
      <mesh position={[length + 0.5, 0.01, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <Text
        position={[length + 1, 0.2, 0]}
        fontSize={0.5}
        color="red"
        anchorX="left"
        anchorY="middle"
      >
        X
      </Text>

      {/* Y Axis */}
      <line>
        <bufferGeometry
          attach="geometry"
          attributes={{
            position: new THREE.Float32BufferAttribute(
              [0, -length, 0, 0, length, 0],
              3
            ),
          }}
        />
        <lineBasicMaterial attach="material" color="green" />
      </line>
      <mesh position={[0, length + 0.5, 0]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshBasicMaterial color="green" />
      </mesh>
      <Text
        position={[0.3, length + 0.5, 0]}
        fontSize={0.5}
        color="green"
        anchorX="left"
        anchorY="middle"
      >
        Y
      </Text>

      {/* Z Axis */}
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
        <lineBasicMaterial attach="material" color="blue" />
      </line>
      <mesh position={[0, 0.01, length + 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshBasicMaterial color="blue" />
      </mesh>

      <Text
        position={[0.4, 0.2, length + 0.5]}
        fontSize={0.5}
        color="blue"
        anchorX="left"
        anchorY="middle"
      >
        Z
      </Text>
    </group>
  );
}
