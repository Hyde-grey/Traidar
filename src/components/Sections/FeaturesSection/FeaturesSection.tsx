import { motion } from "framer-motion";
import styles from "./FeaturesSection.module.css";

const FeaturesSection = () => {
  return (
    <motion.div className={styles.featuresSection}>
      <div className={styles.featuresContent}>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.featuresTitle}
        >
          Key Features
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.featuresSubtitle}
        >
          Discover the tools that give you an edge.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default FeaturesSection;
