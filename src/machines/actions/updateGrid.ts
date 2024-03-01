import { GameContext, GameEvent } from "../../types/Machine";

export const updateGridAssign = (context: GameContext, event: GameEvent) => {
    if (event.type !== 'MOVE' ) return context.grid;
    const newGrid = context.grid.map(row => [...row]);

    if (context.status !== 'demo' && (context.currentPath[context.currentIndex].x !== event.nextPosition.x || context.currentPath[context.currentIndex].y !== event.nextPosition.y)) {
        // If the position is invalid, the tile will be marked as 'fail'.
        newGrid[event.nextPosition.y][event.nextPosition.x] = 'fail';
        return newGrid;
    } else if (context.status !== 'demo' && context.currentIndex === context.currentPath.length - 1) {
        // If the position is the last one in the path, the tile will be marked as 'success'.
        newGrid[event.nextPosition.y][event.nextPosition.x] = 'success';
        return newGrid;
    }

    // otherwise, the tile will be marked as the direction of the next position.
    newGrid[event.nextPosition.y][event.nextPosition.x] = event.direction;
    return newGrid;
};