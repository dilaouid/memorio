import { GameContext } from "../../types/Machine";

export const removeScorePopupAssign = (context: GameContext) => {
    const lastPopup = context.popups[context.popups.length - 1];
    return {
        popups: !lastPopup ? context.popups : context.popups.filter(popup => popup.id !== lastPopup.id)
    };
};