import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { editorState } from "../../state/valtioStore";

export default function CustomOrbitControls() {
  const { gl } = useThree();
  const snap = useSnapshot(editorState);

  return (
    <OrbitControls
      makeDefault
      enableRotate={!snap.current} // disable rotate when a model is selected
      enablePan={!snap.current}
      enableZoom={true}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 1.4}
      minAzimuthAngle={-Math.PI / 4}
      maxAzimuthAngle={Math.PI / 4}
      domElement={gl.domElement}
    />
  );
}
