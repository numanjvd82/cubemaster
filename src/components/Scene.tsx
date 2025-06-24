"use client";
import { useCubeStore } from "@/store/useCubeStore";
import { useState } from "react";
import * as THREE from "three";
import Cubelet, { Face } from "./Cubelet";
import RotatingLayer from "./RotatingLayer";

export default function Scene() {
  const cube = useCubeStore((s) => s.cube);
  const rotateLayer = useCubeStore((s) => s.rotateLayer);
  const inputLocked = useCubeStore((s) => s.inputLocked);
  const setInputLocked = useCubeStore((s) => s.setInputLocked);

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
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return null;

    let axis: "x" | "y" | "z";
    let direction: 1 | -1;

    switch (face) {
      case "pz":
      case "nz":
        axis = Math.abs(dx) > Math.abs(dy) ? "y" : "x";
        direction =
          face === "pz"
            ? ((Math.sign(dx) * (axis === "y" ? 1 : -1)) as 1 | -1)
            : ((Math.sign(dx) * (axis === "y" ? -1 : 1)) as 1 | -1);
        break;

      case "px":
      case "nx":
        axis = Math.abs(dx) > Math.abs(dy) ? "z" : "y";
        direction =
          face === "px"
            ? ((Math.sign(dx) * (axis === "z" ? -1 : 1)) as 1 | -1)
            : ((Math.sign(dx) * (axis === "z" ? 1 : -1)) as 1 | -1);
        break;

      case "py":
      case "ny":
        axis = Math.abs(dx) > Math.abs(dy) ? "z" : "x";
        direction =
          face === "py"
            ? ((Math.sign(dx) * (axis === "z" ? 1 : -1)) as 1 | -1)
            : ((Math.sign(dx) * (axis === "z" ? -1 : 1)) as 1 | -1);
        break;

      default:
        return null;
    }

    const layer = axis === "x" ? pos[0] : axis === "y" ? pos[1] : pos[2];

    return {
      axis,
      layer,
      direction: direction > 0 ? 1 : -1,
    };
  }

  const handleDrag = (
    face: Face,
    pos: [number, number, number],
    drag: { dx: number; dy: number }
  ) => {
    if (inputLocked) {
      console.log("🚫 Input locked, ignoring drag");
      return;
    }

    const result = resolveDragRotation(face, pos, drag);
    if (!result) return;

    const { axis, layer, direction } = result;

    console.log("🌀 Rotate:", { axis, layer, direction });

    setInputLocked(true);
    setPendingRotation({ axis, layer, direction });
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
    if (inputLocked) {
      return;
    }

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
            setInputLocked(false);
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
