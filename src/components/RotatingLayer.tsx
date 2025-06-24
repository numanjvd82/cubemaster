"use client";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group } from "three";

type Props = {
  axis: "x" | "y" | "z";
  direction: 1 | -1;
  onComplete: () => void;
  children: React.ReactNode;
};

export default function RotatingLayer({
  axis,
  direction,
  onComplete,
  children,
}: Props) {
  const group = useRef<Group>(null);
  const [angle, setAngle] = useState(0);
  const speed = Math.PI / 2 / 15; // 90° in ~15 frames

  useFrame(() => {
    if (!group.current) return;

    const delta = speed * direction;

    let newAngle = angle + delta;
    if (Math.abs(newAngle) >= Math.PI / 2) {
      newAngle = (Math.sign(newAngle) * Math.PI) / 2;
    }

    setAngle(newAngle);

    group.current.rotation[axis] = newAngle;

    if (Math.abs(newAngle) >= Math.PI / 2 - 0.0001) {
      onComplete(); // signal end of animation
    }
  });

  return <group ref={group}>{children}</group>;
}
