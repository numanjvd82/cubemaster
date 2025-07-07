"use client";

import { motion } from "motion/react";

type DividerProps = {
  type:
    | "wave"
    | "slant"
    | "curve"
    | "zigzag"
    | "tilt"
    | "layered"
    | "triangle"
    | "arrow"
    | "rounded";
  position?: "top" | "bottom" | "both";
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  withPattern?: boolean;
  patternOpacity?: number;
  animate?: boolean;
};

export default function SectionDivider({
  type = "wave",
  position = "bottom",
  height = 120,
  primaryColor = "rgba(0, 0, 0, 0.3)",
  secondaryColor = "rgba(79, 70, 229, 0.15)",
  withPattern = false,
  patternOpacity = 0.2,
  animate = true,
}: DividerProps) {
  const dividers = {
    wave: {
      top: (
        <path
          d="M0,128L48,112C96,96,192,64,288,69.3C384,75,480,117,576,133.3C672,149,768,139,864,122.7C960,107,1056,85,1152,69.3C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          fill={primaryColor}
        />
      ),
      bottom: (
        <path
          d="M0,32L48,53.3C96,75,192,117,288,122.7C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill={primaryColor}
        />
      ),
    },
    slant: {
      top: <path d="M0,160L1440,0L1440,0L0,0Z" fill={primaryColor} />,
      bottom: <path d="M0,0L1440,160L1440,320L0,320Z" fill={primaryColor} />,
    },
    curve: {
      top: <path d="M0,160Q720,0,1440,160L1440,0L0,0Z" fill={primaryColor} />,
      bottom: (
        <path d="M0,0Q720,160,1440,0L1440,320L0,320Z" fill={primaryColor} />
      ),
    },
    zigzag: {
      top: (
        <path
          d="M0,160L240,96L480,160L720,96L960,160L1200,96L1440,160L1440,0L0,0Z"
          fill={primaryColor}
        />
      ),
      bottom: (
        <path
          d="M0,0L240,64L480,0L720,64L960,0L1200,64L1440,0L1440,320L0,320Z"
          fill={primaryColor}
        />
      ),
    },
    tilt: {
      top: <path d="M0,160L1440,64L1440,0L0,0Z" fill={primaryColor} />,
      bottom: <path d="M0,64L1440,160L1440,320L0,320Z" fill={primaryColor} />,
    },
    layered: {
      top: (
        <>
          <path
            d="M0,96L60,85.3C120,75,240,53,360,69.3C480,85,600,139,720,138.7C840,139,960,85,1080,80C1200,75,1320,117,1380,138.7L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            fill={primaryColor}
          />
          <path
            d="M0,64L60,53.3C120,43,240,21,360,42.7C480,64,600,128,720,138.7C840,149,960,107,1080,80C1200,53,1320,43,1380,37.3L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            fill={secondaryColor}
          />
        </>
      ),
      bottom: (
        <>
          <path
            d="M0,128L60,138.7C120,149,240,171,360,154.7C480,139,600,85,720,80C840,75,960,117,1080,128C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            fill={primaryColor}
          />
          <path
            d="M0,192L60,170.7C120,149,240,107,360,112C480,117,600,171,720,170.7C840,171,960,117,1080,101.3C1200,85,1320,107,1380,117.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            fill={secondaryColor}
          />
        </>
      ),
    },
    triangle: {
      top: <path d="M720,0L1440,160L0,160Z" fill={primaryColor} />,
      bottom: <path d="M720,320L0,160L1440,160Z" fill={primaryColor} />,
    },
    arrow: {
      top: <path d="M720,0L1440,100L0,100Z" fill={primaryColor} />,
      bottom: <path d="M720,320L0,220L1440,220Z" fill={primaryColor} />,
    },
    rounded: {
      top: (
        <path
          d="M0,160C320,20,420,20,720,92C1020,160,1380,20,1440,0L1440,0L0,0Z"
          fill={primaryColor}
        />
      ),
      bottom: (
        <path
          d="M0,160C320,20,420,20,720,92C1020,160,1380,20,1440,0L1440,320L0,320Z"
          fill={primaryColor}
        />
      ),
    },
  };

  // Define pattern markup
  const pattern = (
    <defs>
      <pattern
        id="divider-pattern"
        x="0"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M10,0L20,10L10,20L0,10Z"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
        />
      </pattern>
    </defs>
  );

  // For both top and bottom
  if (position === "both") {
    return (
      <div className="relative w-full" style={{ height: `${height * 2}px` }}>
        {/* Top divider */}
        <div
          className="absolute top-0 left-0 w-full"
          style={{ height: `${height}px` }}
        >
          <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={animate ? { opacity: 0, y: 20 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8 }}
          >
            {withPattern && pattern}
            {dividers[type].top}
            {withPattern && (
              <rect
                width="100%"
                height="100%"
                fill="url(#divider-pattern)"
                style={{ opacity: patternOpacity }}
              />
            )}
          </motion.svg>
        </div>

        {/* Bottom divider */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{ height: `${height}px` }}
        >
          <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={animate ? { opacity: 0, y: -20 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {withPattern && pattern}
            {dividers[type].bottom}
            {withPattern && (
              <rect
                width="100%"
                height="100%"
                fill="url(#divider-pattern)"
                style={{ opacity: patternOpacity }}
              />
            )}
          </motion.svg>
        </div>
      </div>
    );
  }

  // For single divider (top or bottom)
  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={
          animate ? { opacity: 0, y: position === "top" ? -20 : 20 } : undefined
        }
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8 }}
      >
        {withPattern && pattern}
        {dividers[type][position]}
        {withPattern && (
          <rect
            width="100%"
            height="100%"
            fill="url(#divider-pattern)"
            style={{ opacity: patternOpacity }}
          />
        )}
      </motion.svg>
    </div>
  );
}
