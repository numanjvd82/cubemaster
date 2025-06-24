type Face = "px" | "nx" | "py" | "ny" | "pz" | "nz";
type FaceColorMap = Partial<Record<Face, string>>;

export type Cubelet = {
  id: string; // unique ID
  position: [number, number, number]; // x, y, z from -1 to 1
  colors: FaceColorMap; // only visible faces
};

type CubeState = Cubelet[];

export function createSolvedCube(): CubeState {
  const faceColors = {
    px: "#E63946", // Red
    nx: "#F4A261", // Orange
    py: "#F1FAEE", // Off White
    ny: "#FFD166", // Soft Yellow
    pz: "#06D6A0", // Mint Green
    nz: "#118AB2", // Sky Blue
  };

  const cubelets: Cubelet[] = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue; // skip center

        const colors: FaceColorMap = {};
        if (x === 1) colors.px = faceColors.px;
        if (x === -1) colors.nx = faceColors.nx;
        if (y === 1) colors.py = faceColors.py;
        if (y === -1) colors.ny = faceColors.ny;
        if (z === 1) colors.pz = faceColors.pz;
        if (z === -1) colors.nz = faceColors.nz;

        cubelets.push({
          id: `${x},${y},${z}`,
          position: [x, y, z],
          colors,
        });
      }
    }
  }

  return cubelets;
}
