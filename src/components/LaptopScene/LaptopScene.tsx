import { TraidarLaptop } from "../Models/TraidarLaptop";
import { Canvas } from "@react-three/fiber";
import { Float, PerspectiveCamera, ScrollControls } from "@react-three/drei";
import { motion } from "framer-motion";
import styles from "./LaptopScene.module.css";

const LaptopScene = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 1, delay: 1, ease: "easeOut" },
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.3, ease: "easeIn" },
      }}
      className={styles.canvasContainer}
    >
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          scrollbarWidth: "none",
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        {/* Base ambient light for overall scene illumination */}
        <ambientLight intensity={0.3} />

        {/* Hemisphere light for natural sky/ground lighting */}
        <hemisphereLight args={["#ffffff", "#000000", 0.5]} />

        {/* Main key light - warm white for primary illumination */}
        <directionalLight position={[-5, 5, 5]} intensity={2} color="#fff5e6" />

        {/* Fill light - softer orange glow from right */}
        <directionalLight
          position={[5, 3, 2]}
          intensity={1.5}
          color="#f38439"
        />

        {/* Rim light - cool blue backlight for edge definition */}
        <directionalLight
          position={[0, 2, -5]}
          intensity={0.8}
          color="#f38439"
        />
        <ScrollControls pages={0}>
          <Float rotationIntensity={0} floatIntensity={1.5}>
            <TraidarLaptop />
          </Float>
        </ScrollControls>
      </Canvas>
    </motion.div>
  );
};

export default LaptopScene;
