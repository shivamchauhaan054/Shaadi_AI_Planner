import { MOTION } from "@/lib/motion/config";

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.07,
      duration: MOTION.duration.slow,
      ease: MOTION.ease,
    },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: MOTION.duration.normal, ease: MOTION.ease },
  },
};

export const slideStep = {
  enter: (direction: number) => ({
    x: direction > 0 ? 16 : -16,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -16 : 16,
    opacity: 0,
  }),
};

export const slideStepTransition = {
  x: MOTION.spring,
  opacity: { duration: MOTION.duration.fast },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.duration.normal, ease: MOTION.ease },
  },
};
