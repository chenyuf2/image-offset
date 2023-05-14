import "./App.scss";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import Scene from "components/Scene/Scene";
const App = () => {
  return (
    <Canvas linear legacy dpr={Math.max(window.devicePixelRatio, 2)}>
      <Scene />
    </Canvas>
  );
};

export default App;
