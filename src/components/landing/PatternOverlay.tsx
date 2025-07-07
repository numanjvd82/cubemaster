"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

type PatternOverlayProps = {
  pattern:
    | "grid"
    | "dots"
    | "circuit"
    | "hexagons"
    | "triangles"
    | "waves"
    | "squares"
    | "diamonds";
  opacity?: number;
  className?: string;
  children?: ReactNode;
};

export function PatternOverlay({
  pattern,
  opacity = 0.05,
  className = "",
  children,
}: PatternOverlayProps) {
  // Pattern definitions
  const patterns = {
    grid: (
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <pattern
            id="grid-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid-pattern)"
          style={{ opacity }}
        />
      </svg>
    ),
    dots: (
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <pattern
            id="dots-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#dots-pattern)"
          style={{ opacity }}
        />
      </svg>
    ),
    circuit: (
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <pattern
            id="circuit-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 50 35 L 65 50 L 35 50 L 50 65 L 50 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M 0 50 L 35 50 M 65 50 L 100 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle cx="50" cy="50" r="3" fill="currentColor" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#circuit-pattern)"
          style={{ opacity }}
        />
      </svg>
    ),
    hexagons: (
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <pattern
            id="hexagon-pattern"
            x="0"
            y="0"
            width="50"
            height="88"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M25,44 L43.3,33 L43.3,11 L25,0 L6.7,11 L6.7,33 L25,44 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M25,88 L43.3,77 L43.3,55 L25,44 L6.7,55 L6.7,77 L25,88 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M68.3,77 L50,88 L31.7,77 L31.7,55 L50,44 L68.3,55 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              transform="translate(-25, -44)"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#hexagon-pattern)"
          style={{ opacity }}
        />
      </svg>
    ),
    triangles: (
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <pattern
            id="triangle-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,0 L20,40 L40,0 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#triangle-pattern)"
          style={{ opacity }}
        />
      </svg>
    ),
    waves: (
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <pattern
            id="waves-pattern"
            x="0"
            y="0"
            width="100"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,10 Q25,20 50,10 Q75,0 100,10"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#waves-pattern)"
          style={{ opacity }}
        />
      </svg>
    ),
    squares: (
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <pattern
            id="squares-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="5"
              y="5"
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#squares-pattern)"
          style={{ opacity }}
        />
      </svg>
    ),
    diamonds: (
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <pattern
            id="diamonds-pattern"
            x="0"
            y="0"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M15,0 L30,15 L15,30 L0,15 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#diamonds-pattern)"
          style={{ opacity }}
        />
      </svg>
    ),
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 text-white pointer-events-none"
      >
        {patterns[pattern]}
      </motion.div>
      {children}
    </div>
  );
}
