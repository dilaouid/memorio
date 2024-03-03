import { LampStatus } from "../../types/LampStatus";
import { ScorePopupProps } from "../../types/ScorePopupProps";
import { calculateScore } from "../../utils/gameUtils";
import { GameContext } from "../../types/Machine";

const PATH_LENGTH_MAX = import.meta.env.VITE_DEFAUT_PATHLENGTH_MAX as number;
const PATH_LENGTH_HARDCORE_MAX = import.meta.env.VITE_HARDCORE_PATHLENGTH_MAX as number;

const newDifficulty = (context: GameContext) => {
    const maxPathLength = context.isHardcoreMode ? PATH_LENGTH_HARDCORE_MAX : PATH_LENGTH_MAX;
    return Math.min(context.pathLength + 1, maxPathLength as number)
};

const calculateDemoDelay = (context: GameContext, random: number) => {
    const isHardcore = context.isHardcoreMode;
    const isSlowMode = context.isSlowMode;

    if (random < 0.3 && !isHardcore) {
        return context.demoDelay;
    }

    if (isHardcore) {
        return Math.max(context.hardCoreDelay, 60);
    } else if (isSlowMode) {
        return Math.max(context.demoDelay * 0.9, 500)
    } else {
        return Math.max(context.demoDelay * 0.9, 100);
    }
};

export const winSchemaAssign = (context: GameContext) => {
    const gainedPoints = calculateScore(context);
    const newPopup: ScorePopupProps = {
        id: `${new Date().getTime()}`,
        score: gainedPoints,
        // Below, we're using the current path index to determine the position of the score popup.
        top: `${context.currentPath[context.currentPath.length - 1].y * 100}px`,
        left: `${context.currentPath[context.currentPath.length - 1].x * 100}px`
    };
    const random = Math.random();
    return {
        popups: [...context.popups, newPopup],
        score: context.score + gainedPoints,

        // pathLength will MAYBE be increased by 1
        pathLength: random < 0.3 ? context.pathLength : newDifficulty(context),

        // demoDelay will MAYBE be decreased
        demoDelay: calculateDemoDelay(context, random),
        status: 'success' as LampStatus
    };
};