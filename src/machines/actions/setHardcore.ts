import { GameContext } from "../../types/Machine";

export const setHardcoreAssign = (context: GameContext) => {
    return {
        isHardcoreMode: !context.isHardcoreMode,
        savedDemoDelay: context.demoDelay,
        demoDelay: context.isHardcoreMode ? context.savedDemoDelay : context.hardCoreDelay
    };
};