"use client";
import { useCubeStore } from "@/store/useCubeStore";
import { useRef } from "react";
import * as THREE from "three";
import Cubelet from "./Cubelet";

export default function Scene() {
  const cube = useCubeStore((s) => s.cube);
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {cube.map((cubelet) => (
        <Cubelet
          key={cubelet.id}
          position={new THREE.Vector3(...cubelet.position)}
          colors={cubelet.colors}
        />
      ))}
    </group>
  );
}
