"use client";
import { useCubeStore } from "@/store/useCubeStore";
import { useState } from "react";
import * as THREE from "three";
import Cubelet, { Face } from "./Cubelet";
import RotatingLayer from "./RotatingLayer";

export default function Scene() {
  const cube = useCubeStore((s) => s.cube);
  const rotateLayer = useCubeStore((s) => s.rotateLayer);

  const [pendingRotation, setPendingRotation] = useState<null | {
    axis: "x" | "y" | "z";
    layer: number;
    direction: 1 | -1;
  }>(null);

  function resolveDragRotation(
    face: Face,
    pos: [number, number, number],
    drag: { dx: number; dy: number }
  ): { axis: "x" | "y" | "z"; layer: number; direction: 1 | -1 } | null {
    const threshold = 5;
    const { dx, dy } = drag;

    // If no significant drag, ignore
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return null;

    // Determine major direction
    const isHorizontal = Math.abs(dx) > Math.abs(dy);

    let axis: "x" | "y" | "z";
    let direction: 1 | -1;
    let layer: number;

    const [x, y, z] = pos;

    switch (face) {
      case "pz": // Front face
        axis = isHorizontal ? "y" : "x";
        layer = isHorizontal ? y : x;
        direction = isHorizontal ? (dx > 0 ? 1 : -1) : dy > 0 ? -1 : 1;
        break;

      case "nz": // Back face
        axis = isHorizontal ? "y" : "x";
        layer = isHorizontal ? y : x;
        direction = isHorizontal ? (dx > 0 ? -1 : 1) : dy > 0 ? 1 : -1;
        break;

      case "px": // Right face
        axis = isHorizontal ? "z" : "y";
        layer = isHorizontal ? z : y;
        direction = isHorizontal ? (dx > 0 ? -1 : 1) : dy > 0 ? -1 : 1;
        break;

      case "nx": // Left face
        axis = isHorizontal ? "z" : "y";
        layer = isHorizontal ? z : y;
        direction = isHorizontal ? (dx > 0 ? 1 : -1) : dy > 0 ? 1 : -1;
        break;

      case "py": // Top face
        axis = isHorizontal ? "z" : "x";
        layer = isHorizontal ? z : x;
        direction = isHorizontal ? (dx > 0 ? 1 : -1) : dy > 0 ? 1 : -1;
        break;

      case "ny": // Bottom face
        axis = isHorizontal ? "z" : "x";
        layer = isHorizontal ? z : x;
        direction = isHorizontal ? (dx > 0 ? -1 : 1) : dy > 0 ? -1 : 1;
        break;

      default:
        return null;
    }

    return {
      axis,
      layer,
      direction,
    };
  }

  const handleDrag = (
    face: Face,
    pos: [number, number, number],
    drag: { dx: number; dy: number }
  ) => {
    const result = resolveDragRotation(face, pos, drag);
    if (!result) return;

    const { axis, layer, direction } = result;

    setTimeout(() => {
      setPendingRotation({ axis, layer, direction });
    }, 200); // Small delay to allow UI feedback
  };

  const getLayerCubelets = (axis: "x" | "y" | "z", layer: number) => {
    return cube.filter((cubelet) => {
      const [x, y, z] = cubelet.position;
      if (axis === "x") return x === layer;
      if (axis === "y") return y === layer;
      if (axis === "z") return z === layer;
      return false;
    });
  };

  const handleFaceClick = (face: Face, pos: [number, number, number]) => {
    console.log("👆 Face clicked:", face, "at", pos);

    // For now, this is just for feedback
  };

  return (
    <>
      {pendingRotation ? (
        <RotatingLayer
          axis={pendingRotation.axis}
          direction={pendingRotation.direction}
          onComplete={() => {
            rotateLayer(
              pendingRotation.axis,
              pendingRotation.layer as 0 | 1 | -1,
              pendingRotation.direction
            );

            setPendingRotation(null);
          }}
        >
          {getLayerCubelets(pendingRotation.axis, pendingRotation.layer).map(
            (cubelet) => (
              <Cubelet
                key={cubelet.id}
                position={new THREE.Vector3(...cubelet.position)}
                colors={cubelet.colors}
                onFaceClick={handleFaceClick}
                onFaceDrag={handleDrag}
              />
            )
          )}
        </RotatingLayer>
      ) : (
        cube.map((cubelet) => (
          <Cubelet
            key={cubelet.id}
            position={new THREE.Vector3(...cubelet.position)}
            colors={cubelet.colors}
            onFaceClick={handleFaceClick}
            onFaceDrag={handleDrag}
          />
        ))
      )}
    </>
  );
}
