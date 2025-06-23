import { ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Mesh, MeshStandardMaterial, Vector3 } from "three";

export type Face = "px" | "nx" | "py" | "ny" | "pz" | "nz";
export type FaceColorMap = Partial<Record<Face, string>>;

type CubeletProps = {
  position: Vector3;
  colors: FaceColorMap;
  onFaceClick?: (face: Face, position: [number, number, number]) => void;
};

export default function Cubelet({
  position,
  colors,
  onFaceClick,
}: CubeletProps) {
  const ref = useRef<Mesh>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const faceOrder: Face[] = ["px", "nx", "py", "ny", "pz", "nz"];
  const baseMaterials = useMemo(() => {
    const getColor = (face: Face) => colors[face] || "black";
    return faceOrder.map(
      (face) => new MeshStandardMaterial({ color: getColor(face) })
    );
  }, [colors]);

  const materials = useMemo(() => {
    return baseMaterials.map((mat, i) => {
      if (i === hoveredIndex) {
        const hoverMat = mat.clone();
        hoverMat.color.set("#aaaaaa");
        hoverMat.emissive.set("#333");
        return hoverMat;
      }
      return mat;
    });
  }, [hoveredIndex]); // <- Only depend on hovered index

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    const faceIndex = e.faceIndex ?? -1;
    const matIndex = Math.floor(faceIndex / 2);
    setHoveredIndex(matIndex);
  };

  const handlePointerOut = () => {
    setHoveredIndex(null);
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation(); // Prevent bubbling to other cubelets

    const faceIndex = e.faceIndex ?? -1;
    const matIndex = Math.floor(faceIndex / 2);
    const face = faceOrder[matIndex];
    const [x, y, z] = [position.x, position.y, position.z];

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
