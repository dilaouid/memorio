import { LampStatus } from "../../types/LampStatus";

export const playerTurnAssign = () => {
    return {
        isDemoPlaying: false,
        startRoundTime: new Date(),
        status: 'yourTurn' as LampStatus
    }
};