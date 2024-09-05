/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const animations = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  // exit: { opacity: 0 },
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      // exit="exit"
      transition={{ duration: 0.9 }}
      className="animation-div"
    >
      {children}
    </motion.div>
  );
}

export default AnimatedPage;
