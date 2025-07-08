import { Face, FaceColorMap } from "@/components/Cubelet";
import { createSolvedCube, isCubeSolved } from "@/lib/cubeLogic";
import { create } from "zustand";

type Move = { axis: "x" | "y" | "z"; layer: number; direction: 1 | -1 };

type CubeStore = {
  cube: ReturnType<typeof createSolvedCube>;
  history: ReturnType<typeof createSolvedCube>[];
  future: ReturnType<typeof createSolvedCube>[];
  moveHistory: Move[];
  scramble: (n: number) => void;
  solve: () => void;
  isCubeSolved: boolean;
  userMoves: number;
  setUserMoves: (moves: number) => void;
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
  userMoves: 0,
  isCubeSolved: false,
  setUserMoves: (moves) => set({ userMoves: moves }),
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
          const rotated: FaceColorMap = { ...colors }; // Start with existing colors

          if (axis === "x") {
            const seq =
              direction === 1
                ? ["py", "pz", "ny", "nz"]
                : ["py", "nz", "ny", "pz"];
            rotated[seq[0] as Face] = colors[seq[3] as Face];
            rotated[seq[1] as Face] = colors[seq[0] as Face];
            rotated[seq[2] as Face] = colors[seq[1] as Face];
            rotated[seq[3] as Face] = colors[seq[2] as Face];
          } else if (axis === "y") {
            const seq =
              direction === 1
                ? ["pz", "nx", "nz", "px"]
                : ["pz", "px", "nz", "nx"];
            rotated[seq[0] as Face] = colors[seq[3] as Face];
            rotated[seq[1] as Face] = colors[seq[0] as Face];
            rotated[seq[2] as Face] = colors[seq[1] as Face];
            rotated[seq[3] as Face] = colors[seq[2] as Face];
          } else if (axis === "z") {
            const seq =
              direction === 1
                ? ["px", "py", "nx", "ny"]
                : ["px", "ny", "nx", "py"];
            rotated[seq[0] as Face] = colors[seq[3] as Face];
            rotated[seq[1] as Face] = colors[seq[0] as Face];
            rotated[seq[2] as Face] = colors[seq[1] as Face];
            rotated[seq[3] as Face] = colors[seq[2] as Face];
          }

          // Clean up: remove any keys not applicable to this cubelet (if desired)
          // Not strictly required if FaceColorMap is partial

          return rotated;
        };

        return {
          ...cubelet,
          position: newPos,
          colors: rotateColors(cubelet.colors),
          id: `${newPos[0]},${newPos[1]},${newPos[2]}`, // update ID
        };
      });

      const solved = isCubeSolved(newCube);
      state.isCubeSolved = solved;

      set({
        cube: newCube,
        history: [...history, cube],
        future: [],
      });

      state.setUserMoves(state.userMoves + 1);

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
