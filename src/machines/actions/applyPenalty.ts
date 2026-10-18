import { tileOffset } from "@utils/gameUtils";

export const applyPenaltyAssign = (context: GameContext) => {
    const maxScoreForPath = 100;
    const penaltyPercent = import.meta.env.VITE_PENALTY_PERCENT;
    const pathLengthFactor = Math.max(context.currentPath.length, 1);

    // Calculate the penalty based on the current score and the penalty percent.
    // The last mistake ends the run, losing the run is punishment enough so it costs no points.
    const lives = Math.max(context.lives - 1, 0);
    const penalty = lives === 0 ? 0 : (maxScoreForPath * penaltyPercent / 100) * pathLengthFactor;
    const newScore = Math.max(context.score - penalty, 0);
    const failedPosition = context.currentPath[context.currentIndex];
    const newPopup = {
        id: `${new Date().getTime()}`,
        score: -penalty,
        label: lives === 0 ? "GAME OVER" : context.streak >= 2 ? "COMBO LOST" : undefined,

        // Below, we're using the current path index to determine the position of the score popup.
        top: tileOffset(failedPosition.y),
        left: tileOffset(failedPosition.x)
    };

    return {
        score: newScore,
        lives,
        streak: 0,
        status: 'error' as LampStatus,
        popups: [...context.popups, newPopup],
        pathLength: Math.max(context.pathLength - 1, Number(import.meta.env.VITE_DEFAUT_PATHLENGTH)),
        demoDelay: Math.min(context.demoDelay + (context.demoDelay * 0.1), 500)
    }
};
