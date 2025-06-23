import { createSolvedCube } from "@/lib/cubeLogic";
import { create } from "zustand";

type CubeStore = {
  cube: ReturnType<typeof createSolvedCube>;
};

export const useCubeStore = create<CubeStore>((set) => ({
  cube: createSolvedCube(),
}));
