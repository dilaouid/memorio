import { LampStatus } from "../../types/LampStatus";
import { ScorePopupProps } from "../../types/ScorePopupProps";
import { calculateScore } from "../../utils/gameUtils";
import { GameContext } from "../../types/Machine";

const newDifficulty = (context: GameContext) => {
    return Math.min(context.pathLength + 1, import.meta.env.VITE_DEFAUT_PATHLENGTH_MAX as number)
};

export const winSchemaAssign = (context: GameContext) => {
    const gainedPoints = calculateScore(context);
    const newPopup: ScorePopupProps = {
        id: `${new Date().getTime()}`,
        score: gainedPoints,
        top: `${context.currentPath[context.currentPath.length - 1].y * 100}px`,
        left: `${context.currentPath[context.currentPath.length - 1].x * 100}px`
    };
    const random = Math.random();
    return {
        popups: [...context.popups, newPopup],
        score: context.score + gainedPoints,
        pathLength: random < 0.3 ? context.pathLength : newDifficulty(context),
        demoDelay: random < 0.3 ? context.demoDelay : Math.max(context.demoDelay * 0.9, 100),
        status: 'success' as LampStatus
    };
};