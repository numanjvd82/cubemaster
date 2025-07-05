import { ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Color, Mesh, MeshStandardMaterial, Vector3 } from "three";

export type Face = "px" | "nx" | "py" | "ny" | "pz" | "nz";
export type FaceColorMap = Partial<Record<Face, string>>;

type CubeletProps = {
  position: Vector3;
  colors: FaceColorMap;
  onFaceClick?: (face: Face, position: [number, number, number]) => void;
  onFaceDrag?: (
    face: Face,
    position: [number, number, number],
    drag: { dx: number; dy: number }
  ) => void;
};

export default function Cubelet({
  position,
  colors,
  onFaceClick,
  onFaceDrag,
}: CubeletProps) {
  const ref = useRef<Mesh>(null);
  const dragStart = useRef<{ x: number; y: number; face: Face } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const faceOrder: Face[] = ["px", "nx", "py", "ny", "pz", "nz"];
  const materials = useMemo(() => {
    return faceOrder.map((face, i) => {
      const color = colors[face] || "#ccc"; // Default color if not specified
      const mat = new MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.2,
        emissive: i === hoveredIndex ? new Color("#ccc") : new Color("black"),
        emissiveIntensity: 0.3,
      });

      return mat;
    });
  }, [colors, hoveredIndex]);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    const faceIndex = e.faceIndex ?? -1;
    const matIndex = Math.floor(faceIndex / 2);
    setHoveredIndex(matIndex);
  };

  const handlePointerOut = () => {
    setHoveredIndex(null);
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    const faceIndex = e.faceIndex ?? -1;
    const matIndex = Math.floor(faceIndex / 2);
    const face = faceOrder[matIndex];
    const [x, y, z] = [position.x, position.y, position.z];

    dragStart.current = { x: e.clientX, y: e.clientY, face };

    const handlePointerUp = (eUp: PointerEvent) => {
      if (!dragStart.current) return;

      const dx = eUp.clientX - dragStart.current.x;
      const dy = eUp.clientY - dragStart.current.y;

      onFaceDrag?.(dragStart.current.face, [x, y, z], { dx, dy });

      dragStart.current = null;
      window.removeEventListener("pointerup", handlePointerUp);
    };

    // Attach global listener for pointerup
    window.addEventListener("pointerup", handlePointerUp, { once: true });

    onFaceClick?.(face, [x, y, z]);
  };

  return (
    <mesh
      position={[position.x, position.y, position.z]}
      ref={ref}
      material={materials}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
    >
      <boxGeometry args={[0.95, 0.95, 0.95]} />
    </mesh>
  );
}
