import { GameContext } from "../../types/Machine";

export const setHardcoreAssign = (context: GameContext) => {
    return {
        isHardcoreMode: !context.isHardcoreMode,
        demoDelay: context.isHardcoreMode ? context.savedDemoDelay : context.hardCoreDelay
    };
};