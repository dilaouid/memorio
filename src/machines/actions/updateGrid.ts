import { GameContext, GameEvent } from "../types";

export const updateGridAssign = (context: GameContext, event: GameEvent) => {
    if (event.type !== 'MOVE' ) return context.grid;
    const newGrid = context.grid.map(row => [...row]);

    if (context.status !== 'demo' && (context.currentPath[context.currentIndex].x !== event.nextPosition.x || context.currentPath[context.currentIndex].y !== event.nextPosition.y)) {
        newGrid[event.nextPosition.y][event.nextPosition.x] = 'fail';
        return newGrid;
    }

    newGrid[event.nextPosition.y][event.nextPosition.x] = event.direction;
    return newGrid;
};