import type { LampStatus } from "../../types/LampStatus";
import type { GameContext } from "../../types/Machine";

export const initializeDemoAssign = (context: GameContext) => {
    return { ...context, currentIndex: 0, isDemoPlaying: true, status: 'demo' as LampStatus };
};