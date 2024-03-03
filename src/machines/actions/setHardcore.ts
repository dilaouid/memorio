import { GameContext } from "../../types/Machine";

export const setHardcoreAssign = (context: GameContext) => {
    if (context.isDemoPlaying) return {};
    return {
        isHardcoreMode: !context.isHardcoreMode,
        savedDemoDelay: context.demoDelay,
        demoDelay: context.isHardcoreMode ? context.savedDemoDelay : context.hardCoreDelay
    };
};