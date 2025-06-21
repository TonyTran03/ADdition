import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function DuckTruck(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/ducktruck.glb");
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="Fire_Truck_1fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="RootNode">
              <group name="Fire_Truck_1">
                <group name="Fire_Truck_01_Body">
                  <mesh
                    name="Fire_Truck_01_Body_Fire_Truck_Mat_0"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.Fire_Truck_01_Body_Fire_Truck_Mat_0.geometry
                    }
                    material={materials.Fire_Truck_Mat}
                  >
                    <group name="Fire_Truck_01_Cabin">
                      <mesh
                        name="Fire_Truck_01_Cabin_Fire_Truck_Mat_0"
                        castShadow
                        receiveShadow
                        geometry={
                          nodes.Fire_Truck_01_Cabin_Fire_Truck_Mat_0.geometry
                        }
                        material={materials.Fire_Truck_Mat}
                      />
                    </group>
                    <group name="Fire_Truck_01_Glass">
                      <mesh
                        name="Fire_Truck_01_Glass_Fire_Truck_Glass_Mat_0"
                        castShadow
                        receiveShadow
                        geometry={
                          nodes.Fire_Truck_01_Glass_Fire_Truck_Glass_Mat_0
                            .geometry
                        }
                        material={materials.Fire_Truck_Glass_Mat}
                      />
                    </group>
                    <group name="Fire_Truck_01_Lights">
                      <mesh
                        name="Fire_Truck_01_Lights_Fire_Truck_Lights__Mat_0"
                        castShadow
                        receiveShadow
                        geometry={
                          nodes.Fire_Truck_01_Lights_Fire_Truck_Lights__Mat_0
                            .geometry
                        }
                        material={materials.Fire_Truck_Lights__Mat}
                      />
                    </group>
                    <group name="Fire_Truck_01_Props">
                      <mesh
                        name="Fire_Truck_01_Props_Fire_Truck_Mat_0"
                        castShadow
                        receiveShadow
                        geometry={
                          nodes.Fire_Truck_01_Props_Fire_Truck_Mat_0.geometry
                        }
                        material={materials.Fire_Truck_Mat}
                      />
                    </group>
                    <group
                      name="Fire_Truck_01_Steering"
                      position={[56, 183, 298]}
                      rotation={[-0.75, 0, 0]}
                    >
                      <mesh
                        name="Fire_Truck_01_Steering_Fire_Truck_Mat_0"
                        castShadow
                        receiveShadow
                        geometry={
                          nodes.Fire_Truck_01_Steering_Fire_Truck_Mat_0.geometry
                        }
                        material={materials.Fire_Truck_Mat}
                      />
                    </group>
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
        <group name="Empty" position={[0, 3.652, 0]} scale={1.976}>
          <mesh
            name="character_duck"
            castShadow
            receiveShadow
            geometry={nodes.character_duck.geometry}
            material={materials["White.026"]}
            position={[0.293, -1.35, 1.213]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.506}
          >
            <mesh
              name="character_duckArmLeft"
              castShadow
              receiveShadow
              geometry={nodes.character_duckArmLeft.geometry}
              material={materials["White.026"]}
              position={[0.204, 0, -0.634]}
            />
            <mesh
              name="character_duckArmRight"
              castShadow
              receiveShadow
              geometry={nodes.character_duckArmRight.geometry}
              material={materials["White.026"]}
              position={[-0.204, 0, -0.634]}
            />
            <group name="character_duckHead" position={[0, 0, -0.704]}>
              <mesh
                name="Cube1338"
                castShadow
                receiveShadow
                geometry={nodes.Cube1338.geometry}
                material={materials["White.026"]}
              />
              <mesh
                name="Cube1338_1"
                castShadow
                receiveShadow
                geometry={nodes.Cube1338_1.geometry}
                material={materials["Yellow.043"]}
              />
              <mesh
                name="Cube1338_2"
                castShadow
                receiveShadow
                geometry={nodes.Cube1338_2.geometry}
                material={materials["Black.027"]}
              />
            </group>
          </mesh>
          <group
            name="Fire_Truck_01_Wheel_FL"
            position={[0.531, -1.575, 1.063]}
            scale={0.005}
          >
            <mesh
              name="Fire_Truck_01_Wheel_FL_Fire_Truck_Mat_0"
              castShadow
              receiveShadow
              geometry={nodes.Fire_Truck_01_Wheel_FL_Fire_Truck_Mat_0.geometry}
              material={materials.Fire_Truck_Mat}
              position={[16.435, 0.07, -0.058]}
            />
          </group>
          <group
            name="Fire_Truck_01_Wheel_FR"
            position={[-0.531, -1.575, 1.063]}
            scale={0.005}
          >
            <mesh
              name="Fire_Truck_01_Wheel_FR_Fire_Truck_Mat_0"
              castShadow
              receiveShadow
              geometry={nodes.Fire_Truck_01_Wheel_FR_Fire_Truck_Mat_0.geometry}
              material={materials.Fire_Truck_Mat}
              position={[-16.382, 0.003, -0.012]}
            />
          </group>
          <group
            name="Fire_Truck_01_Wheel_RL"
            position={[0.455, -1.575, -1.164]}
            scale={0.005}
          >
            <mesh
              name="Fire_Truck_01_Wheel_RL_Fire_Truck_Mat_0"
              castShadow
              receiveShadow
              geometry={nodes.Fire_Truck_01_Wheel_RL_Fire_Truck_Mat_0.geometry}
              material={materials.Fire_Truck_Mat}
              position={[13.181, 0.23, 0]}
            />
          </group>
          <group
            name="Fire_Truck_01_Wheel_RR"
            position={[-0.455, -1.575, -1.164]}
            scale={0.005}
          >
            <mesh
              name="Fire_Truck_01_Wheel_RR_Fire_Truck_Mat_0"
              castShadow
              receiveShadow
              geometry={nodes.Fire_Truck_01_Wheel_RR_Fire_Truck_Mat_0.geometry}
              material={materials.Fire_Truck_Mat}
              position={[-13.238, 0, 0]}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/ducktruck.glb");
