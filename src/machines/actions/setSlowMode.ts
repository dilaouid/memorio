import { GameContext } from "../../types/Machine";

export const setSlowModeAssign = (context: GameContext) => {
    return {
        isSlowMode: !context.isSlowMode,
        savedDemoDelay: context.demoDelay,
        demoDelay: context.isSlowMode ? 600 : context.savedDemoDelay
    };
};