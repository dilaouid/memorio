import { GameContext, GameEvent } from "../../types/Machine";

export const cleanArrowAssignGrid = (context: GameContext, event: GameEvent) => {
    if (event.type !== 'CLEAN_ARROW') return context.grid;
    const newGrid = context.grid.map(row => [...row]);

    // If the position is invalid, return the original grid.
    if (!event.position || event.position?.y < 0 || event.position?.y >= newGrid.length || event.position?.x < 0 || event.position?.x >= newGrid[0].length)
        return newGrid;

    // Set the position to 'back' in the tile grid.
    newGrid[event.position.y][event.position.x] = 'back';
    return newGrid;
};