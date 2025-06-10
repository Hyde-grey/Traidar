import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

import LaptopScene from "../../components/LaptopScene/LaptopScene";
import HeroSection from "../../components/Sections/HeroSection/HeroSection";
import EmotionalHook from "../../components/Sections/EmotionalHook/EmotionalHook";
import FeaturesSection from "../../components/Sections/FeaturesSection/FeaturesSection";
import Orb from "../../components/Motion/Orb/Orb";

import styles from "./Home.module.css";

const Home = () => {
  const [forceHoverState, setForceHoverState] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const emotionalHookRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: emotionalHookRef,
    offset: ["start end", "center center"],
  });
  const rawOrbLeft = useTransform(scrollYProgress, [0, 1], ["70%", "50%"]);
  const orbLeft = useSpring(rawOrbLeft, { stiffness: 60, damping: 25 });

  return (
    <motion.div
      ref={containerRef}
      className={styles.homeWrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
    >
      <div className={styles.snapSection}>
        <HeroSection setForceHoverState={setForceHoverState} />
      </div>
      <div ref={emotionalHookRef} className={styles.snapSection}>
        <EmotionalHook />
      </div>

      <div className={styles.snapSection}>
        <FeaturesSection />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 5, delay: 0.5, ease: "easeInOut" },
        }}
        className={styles.orbWrapper}
        style={{ "--orb-left": orbLeft } as any}
      >
        <Orb rotateOnHover={true} hoverIntensity={0.2} />
      </motion.div>

      <LaptopScene />
    </motion.div>
  );
};

export default Home;
