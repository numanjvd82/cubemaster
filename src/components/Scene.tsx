"use client";
import { useCubeStore } from "@/store/useCubeStore";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import Cubelet, { Face } from "./Cubelet";
import RotatingLayer from "./RotatingLayer";

export default function Scene() {
  const cube = useCubeStore((s) => s.cube);
  const rotateLayer = useCubeStore((s) => s.rotateLayer);
  const { camera } = useThree();

  const [pendingRotation, setPendingRotation] = useState<null | {
    axis: "x" | "y" | "z";
    layer: number;
    direction: 1 | -1;
  }>(null);

  // Camera controls with arrow keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (pendingRotation) return; // Don't move camera during rotation

      const moveDistance = 0.5;
      const rotateAngle = 0.1;

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          camera.position.y += moveDistance;
          camera.lookAt(0, 0, 0);
          break;
        case "ArrowDown":
          event.preventDefault();
          camera.position.y -= moveDistance;
          camera.lookAt(0, 0, 0);
          break;
        case "ArrowLeft":
          event.preventDefault();
          // Rotate camera around the Y-axis (left)
          const leftMatrix = new THREE.Matrix4().makeRotationY(rotateAngle);
          camera.position.applyMatrix4(leftMatrix);
          camera.lookAt(0, 0, 0);
          break;
        case "ArrowRight":
          event.preventDefault();
          // Rotate camera around the Y-axis (right)
          const rightMatrix = new THREE.Matrix4().makeRotationY(-rotateAngle);
          camera.position.applyMatrix4(rightMatrix);
          camera.lookAt(0, 0, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [camera, pendingRotation]);

  function resolveDragRotation(
    face: Face,
    pos: [number, number, number],
    drag: { dx: number; dy: number }
  ): { axis: "x" | "y" | "z"; layer: number; direction: 1 | -1 } | null {
    const threshold = 5;
    const { dx, dy } = drag;

    // If no significant drag, ignore
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return null;

    // Get camera right and up vectors in world space
    const cameraRight = new THREE.Vector3();
    const cameraUp = new THREE.Vector3();

    // Get the camera's right vector (X-axis in camera space)
    cameraRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
    // Get the camera's up vector (Y-axis in camera space)
    cameraUp.set(0, 1, 0).applyQuaternion(camera.quaternion);

    // Calculate world-space drag direction
    const worldDragDirection = new THREE.Vector3();
    worldDragDirection.addScaledVector(cameraRight, dx);
    worldDragDirection.addScaledVector(cameraUp, -dy); // Negative because screen Y is inverted

    // Determine major direction
    const isHorizontal = Math.abs(dx) > Math.abs(dy);

    let axis: "x" | "y" | "z";
    let direction: 1 | -1;
    let layer: number;

    const [x, y, z] = pos;

    // For each face, determine the appropriate rotation based on the face normal
    // and the world-space drag direction
    switch (face) {
      case "pz": // Front face (z=1)
        if (isHorizontal) {
          axis = "y";
          layer = y;
          // Check if drag is more left/right relative to camera
          direction =
            worldDragDirection.dot(new THREE.Vector3(1, 0, 0)) > 0 ? 1 : -1;
        } else {
          axis = "x";
          layer = x;
          // Check if drag is more up/down relative to camera
          direction =
            worldDragDirection.dot(new THREE.Vector3(0, 1, 0)) > 0 ? -1 : 1;
        }
        break;

      case "nz": // Back face (z=-1)
        if (isHorizontal) {
          axis = "y";
          layer = y;
          direction =
            worldDragDirection.dot(new THREE.Vector3(1, 0, 0)) > 0 ? -1 : 1;
        } else {
          axis = "x";
          layer = x;
          direction =
            worldDragDirection.dot(new THREE.Vector3(0, 1, 0)) > 0 ? 1 : -1;
        }
        break;

      case "px": // Right face (x=1)
        if (isHorizontal) {
          axis = "y";
          layer = y;
          direction =
            worldDragDirection.dot(new THREE.Vector3(0, 0, 1)) > 0 ? -1 : 1;
        } else {
          axis = "z";
          layer = z;
          direction =
            worldDragDirection.dot(new THREE.Vector3(0, 1, 0)) > 0 ? 1 : -1;
        }
        break;

      case "nx": // Left face (x=-1)
        if (isHorizontal) {
          axis = "y";
          layer = y;
          direction =
            worldDragDirection.dot(new THREE.Vector3(0, 0, 1)) > 0 ? 1 : -1;
        } else {
          axis = "z";
          layer = z;
          direction =
            worldDragDirection.dot(new THREE.Vector3(0, 1, 0)) > 0 ? -1 : 1;
        }
        break;

      case "py": // Top face (y=1)
        if (isHorizontal) {
          axis = "z";
          layer = z;
          direction =
            worldDragDirection.dot(new THREE.Vector3(1, 0, 0)) > 0 ? 1 : -1;
        } else {
          axis = "x";
          layer = x;
          direction =
            worldDragDirection.dot(new THREE.Vector3(0, 0, 1)) > 0 ? 1 : -1;
        }
        break;

      case "ny": // Bottom face (y=-1)
        if (isHorizontal) {
          axis = "z";
          layer = z;
          direction =
            worldDragDirection.dot(new THREE.Vector3(1, 0, 0)) > 0 ? -1 : 1;
        } else {
          axis = "x";
          layer = x;
          direction =
            worldDragDirection.dot(new THREE.Vector3(0, 0, 1)) > 0 ? -1 : 1;
        }
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
    console.log("👆 Face clicked:", face, "at", pos);

    // For now, this is just for feedback
  };

  return (
    <>
      {pendingRotation ? (
        <>
          {/* Render the rotating layer */}
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

          {/* Render the non-rotating cubelets */}
          {cube
            .filter((cubelet) => {
              const [x, y, z] = cubelet.position;
              if (pendingRotation.axis === "x")
                return x !== pendingRotation.layer;
              if (pendingRotation.axis === "y")
                return y !== pendingRotation.layer;
              if (pendingRotation.axis === "z")
                return z !== pendingRotation.layer;
              return false;
            })
            .map((cubelet) => (
              <Cubelet
                key={cubelet.id}
                position={new THREE.Vector3(...cubelet.position)}
                colors={cubelet.colors}
                onFaceClick={handleFaceClick}
                onFaceDrag={handleDrag}
              />
            ))}
        </>
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
