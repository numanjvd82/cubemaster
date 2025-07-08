"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
  direction: "top" | "left" | "right" | "bottom";
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
}

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

export default function Confetti({
  isActive,
  duration = 3000,
  particleCount = 50,
}: ConfettiProps) {
  const [particles, setParticles] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    // Generate confetti pieces from all directions
    const newParticles: ConfettiPiece[] = [];
    const directions: ("top" | "left" | "right" | "bottom")[] = [
      "top",
      "left",
      "right",
      "bottom",
    ];

    for (let i = 0; i < particleCount; i++) {
      const direction =
        directions[Math.floor(Math.random() * directions.length)];
      let startX, startY, velX, velY;

      // Determine starting position and velocity based on direction
      switch (direction) {
        case "top":
          startX = Math.random() * window.innerWidth;
          startY = -20;
          velX = (Math.random() - 0.5) * 8;
          velY = Math.random() * 4 + 3;
          break;
        case "left":
          startX = -20;
          startY = Math.random() * window.innerHeight;
          velX = Math.random() * 4 + 3;
          velY = (Math.random() - 0.5) * 6;
          break;
        case "right":
          startX = window.innerWidth + 20;
          startY = Math.random() * window.innerHeight;
          velX = -(Math.random() * 4 + 3);
          velY = (Math.random() - 0.5) * 6;
          break;
        case "bottom":
          startX = Math.random() * window.innerWidth;
          startY = window.innerHeight + 20;
          velX = (Math.random() - 0.5) * 8;
          velY = -(Math.random() * 4 + 3);
          break;
      }

      newParticles.push({
        id: i,
        x: startX,
        y: startY,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 20 + 15, // Bigger size: 15-35px
        rotation: Math.random() * 360,
        velocityX: velX,
        velocityY: velY,
        rotationSpeed: (Math.random() - 0.5) * 10,
        direction,
      });
    }
    setParticles(newParticles);

    // Clear particles after duration
    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration, particleCount]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map((particle) => {
        // Calculate final position based on direction
        let finalX, finalY;
        const distance = 200; // How far particles travel

        switch (particle.direction) {
          case "top":
            finalX = particle.x + particle.velocityX * distance;
            finalY = window.innerHeight + 100;
            break;
          case "left":
            finalX = window.innerWidth + 100;
            finalY = particle.y + particle.velocityY * distance;
            break;
          case "right":
            finalX = -100;
            finalY = particle.y + particle.velocityY * distance;
            break;
          case "bottom":
            finalX = particle.x + particle.velocityX * distance;
            finalY = -100;
            break;
          default:
            finalX = particle.x;
            finalY = particle.y;
        }

        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              borderRadius:
                Math.random() > 0.6
                  ? "50%"
                  : Math.random() > 0.3
                  ? "0%"
                  : "20%",
              boxShadow: `0 0 ${particle.size / 3}px ${particle.color}40`,
            }}
            initial={{
              x: particle.x,
              y: particle.y,
              rotate: particle.rotation,
              opacity: 1,
              scale: 0.5,
            }}
            animate={{
              x: finalX,
              y: finalY,
              rotate: particle.rotation + particle.rotationSpeed * 100,
              opacity: 0,
              scale: 1.2,
            }}
            transition={{
              duration: duration / 1000,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}
