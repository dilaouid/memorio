import { generateInitialGrid, generatePath } from "../../utils/gameUtils";
import { GameContext } from "../types";

export const setupGameAssign = (context: GameContext) => {
    const rows = 7;
    const cols = 7;
    const pathLength = context.pathLength;
    const path = generatePath(rows, cols, pathLength);
    const grid = generateInitialGrid(rows, cols, path);
    const startRoundTime = new Date();
    return { ...context, grid, currentPath: path, startRoundTime };
}