// Define the staggered animation for the cards container
export const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Delay between each card animation
    },
  },
  // exit: { opacity: 0 },
};

// Define the animation for individual cards
export const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  // exit: { opacity: 0, y: 20 },
  // transition: { duration: 1 },
};
