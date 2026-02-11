import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const getOffsets = (direction, distance) => {
  switch (direction) {
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    default:
      return { x: 0, y: 0 };
  }
};

const Reveal = ({
  children,
  className = "",
  direction = "up",
  distance = 40,
  threshold = 0.2,
  duration = 0.6,
  delay = 0,
  once = false,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: threshold, once });
  const offsets = getOffsets(direction, distance);

  const variants = {
    hidden: { opacity: 0, x: offsets.x, y: offsets.y },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
