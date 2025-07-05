import { Face, FaceColorMap } from "@/components/Cubelet";
import { createSolvedCube } from "@/lib/cubeLogic";
import { create } from "zustand";

type Move = { axis: "x" | "y" | "z"; layer: number; direction: 1 | -1 };

type CubeStore = {
  cube: ReturnType<typeof createSolvedCube>;
  history: ReturnType<typeof createSolvedCube>[];
  future: ReturnType<typeof createSolvedCube>[];
  moveHistory: Move[];
  scramble: (n: number) => void;
  solve: () => void;
  resetCube: () => void;
  undo: () => void;
  redo: () => void;
  rotateLayer: (
    axis: "x" | "y" | "z",
    layer: -1 | 0 | 1,
    direction: 1 | -1
  ) => void;
  freeLook: boolean;
  setFreeLook: (value: boolean) => void;
};

export const useCubeStore = create<CubeStore>((set, get) => ({
  cube: createSolvedCube(),
  history: [],
  future: [],
  undo: () => {
    const { history, cube, future } = get();
    if (history.length === 0) return;

    const prev = history[history.length - 1];
    set({
      cube: prev,
      history: history.slice(0, -1),
      future: [cube, ...future],
    });
  },

  redo: () => {
    const { future, history, cube } = get();
    if (future.length === 0) return;

    const next = future[0];
    set({
      cube: next,
      history: [...history, cube],
      future: future.slice(1),
    });
  },
  resetCube: () => {
    set({
      cube: createSolvedCube(),
      moveHistory: [],
      history: [],
      future: [],
    });
  },

  rotateLayer: (axis, layer, direction) =>
    set((state) => {
      const { cube, history } = get();

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

      set({
        cube: newCube,
        history: [...history, cube],
        future: [],
      });

      return {
        cube: newCube,
        moveHistory: [...state.moveHistory, { axis, layer, direction }],
        history: [...history, cube],
        future: [],
      };
    }),

  scramble: (n) => {
    const { rotateLayer } = get();
    const axes = ["x", "y", "z"] as const;
    const layers = [-1, 0, 1];
    const directions = [1, -1] as const;

    for (let i = 0; i < n; i++) {
      const axis = axes[Math.floor(Math.random() * axes.length)];
      const layer = layers[Math.floor(Math.random() * layers.length)] as
        | -1
        | 0
        | 1;
      const direction =
        directions[Math.floor(Math.random() * directions.length)];
      rotateLayer(axis, layer, direction);
    }
  },

  solve: () => {
    const { moveHistory, rotateLayer } = get();
    const reversed = [...moveHistory].reverse();

    function step(i: number) {
      if (i >= reversed.length) {
        set({ moveHistory: [] }); // clear after solving
        return;
      }

      const move = reversed[i];
      rotateLayer(
        move.axis,
        move.layer as -1 | 0 | 1,
        (move.direction * -1) as 1 | -1
      );

      setTimeout(() => step(i + 1), 300);
    }

    step(0);
  },

  moveHistory: [],
  freeLook: false,
  setFreeLook: (value) => set({ freeLook: value }),
}));
