import { Face, FaceColorMap } from "@/components/Cubelet";
import { createSolvedCube } from "@/lib/cubeLogic";
import { create } from "zustand";

type CubeStore = {
  cube: ReturnType<typeof createSolvedCube>;
  rotateLayer: (
    axis: "x" | "y" | "z",
    layer: -1 | 0 | 1,
    direction: 1 | -1
  ) => void;
  inputLocked: boolean;
  setInputLocked: (locked: boolean) => void;
};

export const useCubeStore = create<CubeStore>((set) => ({
  cube: createSolvedCube(),
  rotateLayer: (axis, layer, direction) =>
    set((state) => {
      const newCube = state.cube.map((cubelet) => {
        const [x, y, z] = cubelet.position;

        const isInLayer =
          (axis === "x" && x === layer) ||
          (axis === "y" && y === layer) ||
          (axis === "z" && z === layer);

        if (!isInLayer) return cubelet;

        // Rotate the cubelet position
        let newPos: [number, number, number];
        if (axis === "x") {
          newPos = [x, direction * -z, direction * y];
        } else if (axis === "y") {
          newPos = [direction * z, y, direction * -x];
        } else {
          newPos = [direction * -y, direction * x, z];
        }

        const rotateColors = (colors: FaceColorMap): FaceColorMap => {
          const rotated: FaceColorMap = {};

          const copy = (from: Face, to: Face) => {
            if (colors[from]) rotated[to] = colors[from];
          };

          if (axis === "x") {
            if (direction === 1) {
              copy("py", "pz");
              copy("pz", "ny");
              copy("ny", "nz");
              copy("nz", "py");
            } else {
              copy("py", "nz");
              copy("nz", "ny");
              copy("ny", "pz");
              copy("pz", "py");
            }
          } else if (axis === "y") {
            if (direction === 1) {
              copy("pz", "nx");
              copy("nx", "nz");
              copy("nz", "px");
              copy("px", "pz");
            } else {
              copy("pz", "px");
              copy("px", "nz");
              copy("nz", "nx");
              copy("nx", "pz");
            }
          } else if (axis === "z") {
            if (direction === 1) {
              copy("px", "py");
              copy("py", "nx");
              copy("nx", "ny");
              copy("ny", "px");
            } else {
              copy("px", "ny");
              copy("ny", "nx");
              copy("nx", "py");
              copy("py", "px");
            }
          }

          // Preserve all other faces
          for (const face of ["px", "nx", "py", "ny", "pz", "nz"] as Face[]) {
            if (!rotated[face] && colors[face]) {
              rotated[face] = colors[face];
            }
          }

          return rotated;
        };

        return {
          ...cubelet,
          position: newPos,
          colors: rotateColors(cubelet.colors),
          id: `${newPos[0]},${newPos[1]},${newPos[2]}`, // update ID
        };
      });

      return { cube: newCube };
    }),
  inputLocked: false,
  setInputLocked: (locked) => set({ inputLocked: locked }),
}));
