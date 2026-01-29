"use client";

import { motion, type Variants } from "motion/react";

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from "@/components/animate-ui/icons/icon";

type QuizProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    container: {},
    questionMark: {
      initial: { rotate: 0, scale: 1 },
      animate: {
        rotate: [0, -8, 8, 0],
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, ease: "easeInOut", delay: 0.15 },
      },
    },
    backPaper: {
      initial: { x: 0, y: 0 },
      animate: {
        x: [0, -2, 0],
        y: [0, 2, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    },
    frontPaper: {
      initial: { x: 0, y: 0 },
      animate: {
        x: [0, 3, 0],
        y: [0, -3, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    },
  } satisfies Record<string, Variants>,

  bounce: {
    container: {},
    questionMark: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    },
    backPaper: {},
    frontPaper: {},
  } satisfies Record<string, Variants>,

  pulse: {
    container: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.1, 1],
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    },
    questionMark: {},
    backPaper: {},
    frontPaper: {},
  } satisfies Record<string, Variants>,

  slide: {
    container: {},
    questionMark: {},
    backPaper: {},
    frontPaper: {
      initial: { x: 0, y: 0 },
      animate: {
        x: [0, 2, 0],
        y: [0, -2, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: QuizProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants.container}
      initial="initial"
      animate={controls}
      {...props}
    >
      {/* Back paper - L shaped showing behind */}
      <motion.path
        d="M4 7v12c0 1.1.9 2 2 2h12"
        variants={variants.backPaper}
        initial="initial"
        animate={controls}
      />
      {/* Front paper - rounded rectangle */}
      <motion.rect
        x="7"
        y="3"
        width="14"
        height="14"
        rx="2"
        variants={variants.frontPaper}
        initial="initial"
        animate={controls}
      />
      {/* Question mark */}
      <motion.g
        variants={variants.questionMark}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: "14px 10px" }}
      >
        <path d="M12 8c0-1.1.9-2 2-2s2 .9 2 2c0 1.5-2 1.3-2 3" />
        <circle cx="14" cy="14" r="0.5" fill="currentColor" />
      </motion.g>
    </motion.svg>
  );
}

function Quiz(props: QuizProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Quiz,
  Quiz as QuizIcon,
  type QuizProps,
  type QuizProps as QuizIconProps,
};
