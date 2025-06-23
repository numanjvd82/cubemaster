"use client";
import { Cubelet as CubeletType } from "@/lib/cubeLogic";
import { useCubeStore } from "@/store/useCubeStore";
import { useRef, useState } from "react";
import * as THREE from "three";
import Cubelet, { Face } from "./Cubelet";
import RotatingLayer from "./RotatingLayer";

export default function Scene() {
  const cube = useCubeStore((s) => s.cube);
  const groupRef = useRef<THREE.Group>(null);

  const [rotatingLayer, setRotatingLayer] = useState<{
    axis: "x" | "y" | "z";
    layerValue: number;
    direction: 1 | -1;
    cubelets: CubeletType[];
  } | null>(null);

  function triggerRotation(face: Face, position: [number, number, number]) {
    // Step 1: Determine axis & layer
    let axis: "x" | "y" | "z";
    let layerValue: number;
    let direction: 1 | -1 = 1; // default direction for now

    if (face === "px" || face === "nx") {
      axis = "x";
      layerValue = position[0];
      direction = face === "px" ? 1 : -1;
    } else if (face === "py" || face === "ny") {
      axis = "y";
      layerValue = position[1];
      direction = face === "py" ? 1 : -1;
    } else {
      axis = "z";
      layerValue = position[2];
      direction = face === "pz" ? 1 : -1;
    }

    const selected = cube.filter((c) => {
      if (axis === "x") return c.position[0] === layerValue;
      if (axis === "y") return c.position[1] === layerValue;
      return c.position[2] === layerValue;
    });

    setRotatingLayer({
      axis,
      layerValue,
      direction,
      cubelets: selected,
    });
  }

  function handleRotationComplete() {
    // TODO: update the store (next segment)
    setRotatingLayer(null);
  }

  return (
    <group ref={groupRef}>
      {cube
        .filter((c) => {
          if (!rotatingLayer) return true;
          const [x, y, z] = c.position;
          if (rotatingLayer.axis === "x") return x !== rotatingLayer.layerValue;
          if (rotatingLayer.axis === "y") return y !== rotatingLayer.layerValue;
          return z !== rotatingLayer.layerValue;
        })
        .map((cubelet) => (
          <Cubelet
            key={cubelet.id}
            position={new THREE.Vector3(...cubelet.position)}
            colors={cubelet.colors}
            onFaceClick={triggerRotation}
          />
        ))}

      {rotatingLayer && (
        <RotatingLayer
          axis={rotatingLayer.axis}
          direction={rotatingLayer.direction}
          cubelets={rotatingLayer.cubelets}
          onComplete={handleRotationComplete}
        />
      )}
    </group>
  );
}
