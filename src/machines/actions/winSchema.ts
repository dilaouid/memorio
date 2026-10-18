import { calculateScore, getStreakMultiplier, MAX_LIVES, tileOffset } from "@utils/gameUtils";

const PATH_LENGTH_MAX = Number(import.meta.env.VITE_DEFAUT_PATHLENGTH_MAX);
const PATH_LENGTH_HARDCORE_MAX = Number(import.meta.env.VITE_HARDCORE_PATHLENGTH_MAX);

// Every STREAK_FOR_LIFE perfect rounds in a row, the player gets a life back.
const STREAK_FOR_LIFE = 5;

const newDifficulty = (context: GameContext) => {
    const maxPathLength = context.isHardcoreMode ? PATH_LENGTH_HARDCORE_MAX : PATH_LENGTH_MAX;
    return Math.min(context.pathLength + 1, maxPathLength)
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
    const streak = context.streak + 1;
    const multiplier = getStreakMultiplier(context.streak);
    const gainedPoints = Math.floor(calculateScore(context) * multiplier);
    const earnsLife = streak % STREAK_FOR_LIFE === 0 && context.lives < MAX_LIVES;
    const lastPosition = context.currentPath[context.currentPath.length - 1];

    let label: string | undefined;
    if (earnsLife) label = "+1 VALVE";
    else if (multiplier > 1) label = `COMBO x${multiplier}`;

    const newPopup: ScorePopupProps = {
        id: `${new Date().getTime()}`,
        score: gainedPoints,
        label,
        // Below, we're using the last tile of the path to determine the position of the score popup.
        top: tileOffset(lastPosition.y),
        left: tileOffset(lastPosition.x)
    };
    const random = Math.random();
    return {
        popups: [...context.popups, newPopup],
        score: context.score + gainedPoints,
        streak,
        level: context.level + 1,
        lives: earnsLife ? context.lives + 1 : context.lives,

        // pathLength will MAYBE be increased by 1
        pathLength: random < 0.3 ? context.pathLength : newDifficulty(context),

        // demoDelay will MAYBE be decreased
        demoDelay: calculateDemoDelay(context, random),
        status: 'success' as LampStatus
    };
};
