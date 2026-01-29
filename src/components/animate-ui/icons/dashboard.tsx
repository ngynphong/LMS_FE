"use client";

import { motion, type Variants } from "motion/react";

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from "@/components/animate-ui/icons/icon";

type DashboardProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    container: {},
    topLeft: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.9, 1],
        transition: { duration: 0.3, ease: "easeInOut" },
      },
    },
    topRight: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.9, 1],
        transition: { duration: 0.3, ease: "easeInOut", delay: 0.1 },
      },
    },
    bottomLeft: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.9, 1],
        transition: { duration: 0.3, ease: "easeInOut", delay: 0.2 },
      },
    },
    bottomRight: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.9, 1],
        transition: { duration: 0.3, ease: "easeInOut", delay: 0.3 },
      },
    },
  } satisfies Record<string, Variants>,

  pulse: {
    container: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.05, 1],
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    },
    topLeft: {},
    topRight: {},
    bottomLeft: {},
    bottomRight: {},
  } satisfies Record<string, Variants>,

  rotate: {
    container: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 90, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      },
    },
    topLeft: {},
    topRight: {},
    bottomLeft: {},
    bottomRight: {},
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: DashboardProps) {
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
      {/* Top Left - larger square */}
      <motion.rect
        x="3"
        y="3"
        width="8"
        height="9"
        rx="1.5"
        variants={variants.topLeft}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: "7px 7.5px" }}
      />
      {/* Top Right - smaller square */}
      <motion.rect
        x="13"
        y="3"
        width="8"
        height="5"
        rx="1.5"
        variants={variants.topRight}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: "17px 5.5px" }}
      />
      {/* Bottom Left - smaller square */}
      <motion.rect
        x="3"
        y="14"
        width="8"
        height="7"
        rx="1.5"
        variants={variants.bottomLeft}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: "7px 17.5px" }}
      />
      {/* Bottom Right - larger square */}
      <motion.rect
        x="13"
        y="10"
        width="8"
        height="11"
        rx="1.5"
        variants={variants.bottomRight}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: "17px 15.5px" }}
      />
    </motion.svg>
  );
}

function Dashboard(props: DashboardProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Dashboard,
  Dashboard as DashboardIcon,
  type DashboardProps,
  type DashboardProps as DashboardIconProps,
};
