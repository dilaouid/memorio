import { generateInitialGrid, generatePath } from "../../utils/gameUtils";
import { GameContext } from "../../types/Machine";

export const setupGameAssign = (context: GameContext) => {
    const pathLength = context.pathLength;
    const path = generatePath(pathLength);
    const grid = generateInitialGrid(path);
    const startRoundTime = new Date();
    return { ...context, grid, currentPath: path, startRoundTime, startedGame: true };
}