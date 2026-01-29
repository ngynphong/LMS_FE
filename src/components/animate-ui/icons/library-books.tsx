"use client";

import { motion, type Variants } from "motion/react";

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from "@/components/animate-ui/icons/icon";

type LibraryBooksProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    container: {},
    book1: {
      initial: { x: 0 },
      animate: {
        x: [0, -1, 0],
        transition: { duration: 0.3, ease: "easeInOut" },
      },
    },
    book2: {
      initial: { x: 0 },
      animate: {
        x: [0, 1, 0],
        transition: { duration: 0.3, ease: "easeInOut", delay: 0.1 },
      },
    },
    book3: {
      initial: { x: 0 },
      animate: {
        x: [0, -1, 0],
        transition: { duration: 0.3, ease: "easeInOut", delay: 0.2 },
      },
    },
  } satisfies Record<string, Variants>,

  slide: {
    container: {},
    book1: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    },
    book2: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration: 0.4, ease: "easeInOut", delay: 0.1 },
      },
    },
    book3: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration: 0.4, ease: "easeInOut", delay: 0.2 },
      },
    },
  } satisfies Record<string, Variants>,

  pulse: {
    container: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.1, 1],
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    },
    book1: {},
    book2: {},
    book3: {},
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: LibraryBooksProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      variants={variants.container}
      initial="initial"
      animate={controls}
      {...props}
    >
      {/* Book 1 - Left */}
      <motion.path
        d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"
        variants={variants.book1}
        initial="initial"
        animate={controls}
      />
      {/* Book 2 - Middle */}
      <motion.path
        d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 10l-2.5-1.5L15 12V4h5v8z"
        variants={variants.book2}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function LibraryBooks(props: LibraryBooksProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  LibraryBooks,
  LibraryBooks as LibraryBooksIcon,
  type LibraryBooksProps,
  type LibraryBooksProps as LibraryBooksIconProps,
};
