import { MAX_LIVES } from "@utils/gameUtils";

const env = import.meta.env;

// Resets everything related to a run, keeps the player preferences (music, modes).
export const newGameAssign = (context: GameContext) => {
    const demoDelay = context.isHardcoreMode
        ? context.hardCoreDelay
        : context.isSlowMode ? 600 : Number(env.VITE_DEFAUT_DEMO_DELAY);
    return {
        score: 0,
        lives: MAX_LIVES,
        streak: 0,
        level: 1,
        popups: [],
        pathLength: Number(env.VITE_DEFAUT_PATHLENGTH),
        demoDelay,
        savedDemoDelay: Number(env.VITE_DEFAUT_DEMO_DELAY),
    };
};
