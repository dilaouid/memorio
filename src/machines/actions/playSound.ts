import type { GameEvent } from "../../types/Machine";
import type { GameContext } from "../../types/Machine";

export const playSoundAssign = (_context: GameContext, event: GameEvent) => {
  if (event.type === "PLAY_SOUND") {
    const audio = new Audio(event.audioUrl);
    audio.currentTime = 0;
    audio.play().catch((err) => console.error("Error playing sound:", err));
  }
};