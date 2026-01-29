"use client";

import { motion, type Variants } from "motion/react";

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from "@/components/animate-ui/icons/icon";

type MailProps = IconProps<keyof typeof animations>;

const animations = {
  default: (() => {
    const animation: Record<string, Variants> = {
      envelope: {},
      flap: {
        initial: { rotateX: 0 },
        animate: {
          rotateX: [0, -30, 0],
          transition: {
            duration: 0.4,
            ease: "easeInOut",
          },
        },
      },
      letter: {
        initial: { y: 0 },
        animate: {
          y: [0, -3, 0],
          transition: {
            duration: 0.4,
            ease: "easeInOut",
            delay: 0.1,
          },
        },
      },
    };

    return animation;
  })() satisfies Record<string, Variants>,

  // Bounce animation
  bounce: {
    envelope: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      },
    },
    flap: {},
    letter: {},
  } satisfies Record<string, Variants>,

  // Shake animation (like new mail notification)
  shake: {
    envelope: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, -8, 8, -8, 8, 0],
        transition: {
          duration: 0.5,
          ease: "easeInOut",
        },
      },
    },
    flap: {},
    letter: {},
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: MailProps) {
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
      variants={variants.envelope}
      initial="initial"
      animate={controls}
      {...props}
    >
      {/* Envelope body */}
      <motion.rect
        width="20"
        height="14"
        x="2"
        y="5"
        rx="2"
        variants={variants.letter}
        initial="initial"
        animate={controls}
      />
      {/* Envelope flap (the V shape) */}
      <motion.path
        d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
        variants={variants.flap}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: "center top" }}
      />
    </motion.svg>
  );
}

function Mail(props: MailProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Mail,
  Mail as MailIcon,
  type MailProps,
  type MailProps as MailIconProps,
};
