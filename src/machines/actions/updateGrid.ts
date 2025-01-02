import { GameContext, GameEvent } from "../../types/Machine";

export const updateGridAssign = (context: GameContext, event: GameEvent) => {
    if (event.type !== 'MOVE' ) return context.grid;
    const newGrid = context.grid.map(row => [...row]);
    const { nextPosition, direction } = event;
    const { currentIndex, currentPath, status } = context;

    if (status !== 'demo' && (currentPath[currentIndex].x !== nextPosition.x || currentPath[currentIndex].y !== nextPosition.y)) {
        // If the position is invalid, the tile will be marked as 'fail'.
        newGrid[nextPosition.y][nextPosition.x] = 'fail';
        return newGrid;
    } else if (status !== 'demo' && currentIndex === currentPath.length - 1) {
        // If the position is the last one in the path, the tile will be marked as 'success'.
        newGrid[nextPosition.y][nextPosition.x] = 'success';
        return newGrid;
    }

    // otherwise, the tile will be marked as the direction of the next position.
    newGrid[nextPosition.y][nextPosition.x] = direction;
    context.isFlipping = true;
    return newGrid;
};