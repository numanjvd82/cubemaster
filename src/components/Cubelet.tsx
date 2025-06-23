import { useMemo, useRef } from "react";
import { Mesh, MeshStandardMaterial, Vector3 } from "three";

type Face = "px" | "nx" | "py" | "ny" | "pz" | "nz";
type FaceColorMap = Partial<Record<Face, string>>;

type CubeletProps = {
  position: Vector3;
  colors: FaceColorMap;
};

export default function Cubelet({ position, colors }: CubeletProps) {
  const ref = useRef<Mesh>(null);
  const [x, y, z] = [position.x, position.y, position.z];

  const materials = useMemo(() => {
    const getColor = (face: Face) => colors[face] || "black";
    return [
      new MeshStandardMaterial({ color: getColor("px") }), // +X
      new MeshStandardMaterial({ color: getColor("nx") }), // -X
      new MeshStandardMaterial({ color: getColor("py") }), // +Y
      new MeshStandardMaterial({ color: getColor("ny") }), // -Y
      new MeshStandardMaterial({ color: getColor("pz") }), // +Z
      new MeshStandardMaterial({ color: getColor("nz") }), // -Z
    ];
  }, [colors]);

  return (
    <mesh position={[x, y, z]} ref={ref} material={materials}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />
    </mesh>
  );
}
