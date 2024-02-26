import { LampStatus } from "../../types/LampStatus";
import { GameContext } from "../types";

export const applyPenaltyAssign = (context: GameContext) => {
    const maxScoreForPath = 100;
    const penaltyPercent = 25;
    const pathLengthFactor = Math.max(context.currentPath.length, 1);

    const penalty = (maxScoreForPath * penaltyPercent / 100) * pathLengthFactor;
    const newScore = Math.max(context.score - penalty, 0);
    const newPopup = {
        id: `${new Date().getTime()}`,
        score: -penalty,
        top: `${context.currentPath[context.currentIndex].y * 100}px`,
        left: `${context.currentPath[context.currentIndex].x * 100}px`,
        onFadeComplete: () => { },
    };

    return {
        score: newScore,
        status: 'error' as LampStatus,
        popups: [...context.popups, newPopup],
        pathLength: Math.max(context.pathLength - 1, 3),
        demoDelay: Math.min(context.demoDelay + (context.demoDelay * 0.1), 500)
    }
};