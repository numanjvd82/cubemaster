import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import Cubelet, { FaceColorMap } from "./Cubelet";

type CubeletData = {
  id: string;
  position: [number, number, number];
  colors: FaceColorMap;
};

type Props = {
  cubelets: CubeletData[];
  axis: "x" | "y" | "z";
  direction: 1 | -1;
  onComplete: () => void;
};

export default function RotatingLayer({
  cubelets,
  axis,
  direction,
  onComplete,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const [angle, setAngle] = useState(0);
  const speed = 0.1;

  useFrame(() => {
    if (!groupRef.current) return;

    const delta = speed * direction;
    const nextAngle = angle + delta;

    if (Math.abs(nextAngle) >= Math.PI / 2) {
      groupRef.current.rotation[axis] = (Math.PI / 2) * direction;
      onComplete(); // notify Scene to update state
    } else {
      groupRef.current.rotation[axis] = nextAngle;
      setAngle(nextAngle);
    }
  });

  return (
    <group ref={groupRef}>
      {cubelets.map((c) => (
        <Cubelet
          key={c.id}
          position={new THREE.Vector3(...c.position)}
          colors={c.colors}
        />
      ))}
    </group>
  );
}
