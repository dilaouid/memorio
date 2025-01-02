import { GameContext, GameEvent } from "../../types/Machine";

export const cleanArrowAssignGrid = (context: GameContext, event: GameEvent) => {
    if (event.type !== 'CLEAN_ARROW') return context.grid;
    const newGrid = context.grid.map(row => [...row]);
    const { position } = event;

    // If the position is invalid, return the original grid.
    if (!position || position?.y < 0 || position?.y >= newGrid.length || position?.x < 0 || position?.x >= newGrid[0].length)
        return newGrid;

    // Set the position to 'back' in the tile grid.
    newGrid[position.y][position.x] = 'back';
    return newGrid;
};