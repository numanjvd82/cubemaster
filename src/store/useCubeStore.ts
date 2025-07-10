import { Face, FaceColorMap } from "@/components/game/cube/Cubelet";
import { createSolvedCube, isCubeSolved } from "@/lib/cubeLogic";
import { create } from "zustand";

type Move = { axis: "x" | "y" | "z"; layer: number; direction: 1 | -1 };

type CubeStore = {
  cube: ReturnType<typeof createSolvedCube>;
  history: ReturnType<typeof createSolvedCube>[];
  setHistory: (history: ReturnType<typeof createSolvedCube>[]) => void;
  future: ReturnType<typeof createSolvedCube>[];
  moveHistory: Move[];
  scramble: (n: number) => void;
  solve: () => Promise<void>;
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
  setHistory: (history) => set({ history }),
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
          // Create mapping of old face -> new face based on rotation
          const faceMap: Record<Face, Face> = {} as Record<Face, Face>;

          if (axis === "x") {
            // X-axis rotation: py <-> pz <-> ny <-> nz
            if (direction === 1) {
              faceMap.py = "nz";
              faceMap.pz = "py";
              faceMap.ny = "pz";
              faceMap.nz = "ny";
            } else {
              faceMap.py = "pz";
              faceMap.pz = "ny";
              faceMap.ny = "nz";
              faceMap.nz = "py";
            }
          } else if (axis === "y") {
            // Y-axis rotation: pz <-> nx <-> nz <-> px
            if (direction === 1) {
              faceMap.pz = "px";
              faceMap.nx = "pz";
              faceMap.nz = "nx";
              faceMap.px = "nz";
            } else {
              faceMap.pz = "nx";
              faceMap.px = "pz";
              faceMap.nz = "px";
              faceMap.nx = "nz";
            }
          } else if (axis === "z") {
            // Z-axis rotation: px <-> py <-> nx <-> ny
            if (direction === 1) {
              faceMap.px = "ny";
              faceMap.py = "px";
              faceMap.nx = "py";
              faceMap.ny = "nx";
            } else {
              faceMap.px = "py";
              faceMap.py = "nx";
              faceMap.nx = "ny";
              faceMap.ny = "px";
            }
          }

          // Apply the rotation by creating a new color map
          const newColors: FaceColorMap = {};

          // Keep faces that aren't being rotated
          Object.entries(colors).forEach(([face, color]) => {
            if (color !== undefined) {
              const newFace = faceMap[face as Face] || (face as Face);
              newColors[newFace] = color;
            }
          });

          return newColors;
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
    return new Promise<void>((resolve) => {
      const { moveHistory } = get();
      const reversed = [...moveHistory].reverse();

      // Create a version of rotateLayer that doesn't update moveHistory
      const rotateLayerSilent = (
        axis: "x" | "y" | "z",
        layer: -1 | 0 | 1,
        direction: 1 | -1
      ) => {
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
              // Create mapping of old face -> new face based on rotation
              const faceMap: Record<Face, Face> = {} as Record<Face, Face>;

              if (axis === "x") {
                // X-axis rotation: py <-> pz <-> ny <-> nz
                if (direction === 1) {
                  faceMap.py = "nz";
                  faceMap.pz = "py";
                  faceMap.ny = "pz";
                  faceMap.nz = "ny";
                } else {
                  faceMap.py = "pz";
                  faceMap.pz = "ny";
                  faceMap.ny = "nz";
                  faceMap.nz = "py";
                }
              } else if (axis === "y") {
                // Y-axis rotation: pz <-> nx <-> nz <-> px
                if (direction === 1) {
                  faceMap.pz = "px";
                  faceMap.nx = "pz";
                  faceMap.nz = "nx";
                  faceMap.px = "nz";
                } else {
                  faceMap.pz = "nx";
                  faceMap.px = "pz";
                  faceMap.nz = "px";
                  faceMap.nx = "nz";
                }
              } else if (axis === "z") {
                // Z-axis rotation: px <-> py <-> nx <-> ny
                if (direction === 1) {
                  faceMap.px = "ny";
                  faceMap.py = "px";
                  faceMap.nx = "py";
                  faceMap.ny = "nx";
                } else {
                  faceMap.px = "py";
                  faceMap.py = "nx";
                  faceMap.nx = "ny";
                  faceMap.ny = "px";
                }
              }

              // Apply the rotation by creating a new color map
              const newColors: FaceColorMap = {};

              // Keep faces that aren't being rotated
              Object.entries(colors).forEach(([face, color]) => {
                if (color !== undefined) {
                  const newFace = faceMap[face as Face] || (face as Face);
                  newColors[newFace] = color;
                }
              });

              return newColors;
            };

            return {
              ...cubelet,
              position: newPos,
              colors: rotateColors(cubelet.colors),
              id: `${newPos[0]},${newPos[1]},${newPos[2]}`,
            };
          });

          const solved = isCubeSolved(newCube);

          return {
            cube: newCube,
            history: [...history, cube],
            future: [],
            isCubeSolved: solved,
          };
        });
      };

      function step(i: number) {
        if (i >= reversed.length) {
          set({ moveHistory: [] }); // clear after solving
          resolve();
          return;
        }

        const move = reversed[i];
        rotateLayerSilent(
          move.axis,
          move.layer as -1 | 0 | 1,
          (move.direction * -1) as 1 | -1
        );

        setTimeout(() => step(i + 1), 300);
      }

      step(0);
    });
  },

  moveHistory: [],
  freeLook: false,
  setFreeLook: (value) => set({ freeLook: value }),
}));
