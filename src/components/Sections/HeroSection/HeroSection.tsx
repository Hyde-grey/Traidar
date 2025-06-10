import { motion, useAnimation, useInView, Variant } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import Logo from "../../Logo/Logo";
import Title from "../../Title/title";

import styles from "./HeroSection.module.css";

// Define your two variants: one for the first‐load, one for any later in‐view
const variants: Record<"firstLoad" | "scrolledBack", Variant> = {
  firstLoad: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  scrolledBack: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const HeroSection = ({
  setForceHoverState,
  forceHoverState,
}: {
  setForceHoverState: (v: boolean) => void;
  forceHoverState: boolean;
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  // inView becomes true when the title container enters the middle viewport
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });
  // track if the section has left view to guard re-entry animation
  const [hasLeft, setHasLeft] = useState(false);

  // Run this only once, on mount
  useEffect(() => {
    controls.start("firstLoad");
  }, [controls]);

  // mark that the section has left view
  useEffect(() => {
    if (!inView) setHasLeft(true);
  }, [inView]);

  // animate 'scrolledBack' only when re-entering after leaving
  useEffect(() => {
    if (inView && hasLeft) {
      controls.start("scrolledBack");
    }
  }, [controls, inView, hasLeft]);

  return (
    <motion.div className={styles.heroSection}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 400 }}
        // animate via our controls, not a static prop
        animate={controls}
        variants={variants}
        exit={{
          opacity: 0,
          y: 400,
          transition: { duration: 0.3, ease: "easeIn" },
        }}
        className={styles.titleContainer}
      >
        <Logo />
        <Title setForceHoverState={setForceHoverState} />
      </motion.div>
      {/* Dark overlay between title and rest of page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.5, delay: 7.5, ease: "easeOut" },
        }}
        exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
        className={styles.pageOverlay}
      />
    </motion.div>
  );
};

export default HeroSection;
