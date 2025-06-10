import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import styles from "./EmotionalHook.module.css";
import { useScrollLockSection } from "../../../hooks/useScrollLockSection";

const EmotionalHook = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { blurCss, progressScale, indicatorText, isLocked } =
    useScrollLockSection(ref);

  return (
    <motion.div
      ref={ref}
      className={styles.emotionalHook}
      style={{ "--hook-blur": blurCss } as any}
    >
      <div className={styles.emotionalHookContent}>
        {/* Scroll indicator */}
        <AnimatePresence>
          {isLocked && (
            <motion.div
              className={styles.scrollIndicator}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={styles.scrollProgress}
                style={{
                  scaleY: progressScale,
                  opacity: progressScale,
                  transformOrigin: "bottom",
                }}
              />
              <motion.span className={styles.scrollText}>
                {indicatorText}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.h2
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 1 }}
          className={styles.emotionalHookTitle}
        >
          Stay sharp. Stay focused. Stay in the game.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 200 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 1.5 }}
          className={styles.emotionalHookSubtitle}
        >
          When markets move fast and emotions run high, clarity is everything.
          Traidar helps you stay grounded, stay informed, and stay ahead — with
          AI on your side.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default EmotionalHook;
