import { useCubeStore } from "@/store/useCubeStore";
import { Button } from "@headlessui/react";
import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  showReset?: boolean;
  showScramble?: boolean;
  showSolve?: boolean;
  showFreeLook?: boolean;
};

export default function CubeControls({
  showReset = true,
  showScramble = true,
  showSolve = true,
  showFreeLook = true,
}: Props) {
  const freeLook = useCubeStore((s) => s.freeLook);
  const setFreeLook = useCubeStore((s) => s.setFreeLook);
  const undo = useCubeStore((s) => s.undo);
  const redo = useCubeStore((s) => s.redo);
  const history = useCubeStore((s) => s.history);
  const future = useCubeStore((s) => s.future);
  const resetCube = useCubeStore((s) => s.resetCube);
  const scramble = useCubeStore((s) => s.scramble);
  const solve = useCubeStore((s) => s.solve);
  const canUndo = history.length > 0;
  const canRedo = future.length > 0;

  const [isBeingSolved, setIsBeingSolved] = useState(false);

  const handleSolve = async () => {
    setIsBeingSolved(true);
    await solve();
    setIsBeingSolved(false);
  };

  return (
    <motion.div
      className="fixed left-4 top-1/2 transform -translate-y-1/2 z-20"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-2 p-2 bg-black/30 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
        {/* Undo Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Button
            onClick={() => undo()}
            disabled={!canUndo}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
              canUndo
                ? "bg-indigo-600/80 hover:bg-indigo-700/90 text-white shadow-lg cursor-pointer"
                : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
            }`}
            title="Undo"
          >
            <ArrowUturnLeftIcon className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Redo Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Button
            onClick={() => redo()}
            disabled={!canRedo}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
              canRedo
                ? "bg-indigo-600/80 hover:bg-indigo-700/90 text-white shadow-lg cursor-pointer"
                : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
            }`}
            title="Redo"
          >
            <ArrowUturnRightIcon className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-white/20 mx-1"></div>

        {showReset && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Button
              onClick={() => resetCube()}
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-600/80 hover:bg-red-700/90 text-white transition-all duration-200 shadow-lg cursor-pointer"
              title="Reset Cube"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {showScramble && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Button
              onClick={() => scramble(10)}
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-600/80 hover:bg-yellow-700/90 text-white transition-all duration-200 shadow-lg cursor-pointer"
              title="Scramble Cube"
            >
              <PuzzlePieceIcon className="w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {showSolve && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Button
              onClick={() => handleSolve()}
              className={`w-10 h-10 rounded-lg flex items-center justify-center  transition-all duration-200 shadow-lg cursor-pointer ${
                isBeingSolved
                  ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                  : "bg-green-600/80 hover:bg-green-700/90 text-white"
              }`}
              title="Solve Cube"
            >
              <CheckCircleIcon className="w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {/* Divider */}
        {showFreeLook && <div className="h-px bg-white/20 mx-1"></div>}

        {showFreeLook && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Button
              onClick={() => setFreeLook(!freeLook)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer ${
                freeLook
                  ? "bg-purple-600/80 hover:bg-purple-700/90 text-white"
                  : "bg-gray-600/80 hover:bg-gray-700/90 text-white"
              }`}
              title={freeLook ? "Exit Free Look" : "Enter Free Look"}
            >
              {freeLook ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
