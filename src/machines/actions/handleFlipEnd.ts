import type { GameContext, GameEvent } from "../../types/Machine";

export const handleFlipEnd = (context: GameContext, event: GameEvent) => {
    if (event.type !== "TILE_FLIP_END") return context.flippedTiles;
    context.isFlipping = false;
    return context.flippedTiles.filter(
      tile => !(tile.x === event.x && tile.y === event.y)
    )
};