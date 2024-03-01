import { LampStatus } from "../../types/LampStatus";
import { GameContext } from "../../types/Machine";

export const applyPenaltyAssign = (context: GameContext) => {
    const maxScoreForPath = 100;
    const penaltyPercent = import.meta.env.VITE_PENALTY_PERCENT;
    const pathLengthFactor = Math.max(context.currentPath.length, 1);

    // Calculate the penalty based on the current score and the penalty percent.
    const penalty = (maxScoreForPath * penaltyPercent / 100) * pathLengthFactor;
    const newScore = Math.max(context.score - penalty, 0);
    const newPopup = {
        id: `${new Date().getTime()}`,
        score: -penalty,
        

        // Below, we're using the current path index to determine the position of the score popup.
        top: `${context.currentPath[context.currentIndex].y * 100}px`,
        left: `${context.currentPath[context.currentIndex].x * 100}px`
    };

    return {
        score: newScore,
        status: 'error' as LampStatus,
        popups: [...context.popups, newPopup],
        pathLength: Math.max(context.pathLength - 1, import.meta.env.VITE_DEFAUT_PATHLENGTH as number),
        demoDelay: Math.min(context.demoDelay + (context.demoDelay * 0.1), 500)
    }
};