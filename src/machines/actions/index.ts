import { setupGameAssign } from "./setupGame";
import { initializeDemoAssign } from "./initializeDemo";
import { cleanArrowAssignGrid } from "./cleanArrow";
import { updateGridAssign } from "./updateGrid";
import { applyPenaltyAssign } from "./applyPenalty";
import { winSchemaAssign } from "./winSchema";
import { playerTurnAssign } from "./playerTurn";
import { removeScorePopupAssign } from "./removeScorePopup";
import { setHardcoreAssign } from "./setHardcore";
import { setSlowModeAssign } from "./setSlowMode";
import { playSoundAssign } from "./playSound";
import { playStatusSound } from "./playStatusSound";
import { handleFlipEnd } from "./handleFlipEnd";

export const actions = {
    setup: setupGameAssign,
    initialize: initializeDemoAssign,
    cleanArrow: cleanArrowAssignGrid,
    updateGrid: updateGridAssign,
    penalty: applyPenaltyAssign,
    win: winSchemaAssign,
    playerTurn: playerTurnAssign,
    removePopup: removeScorePopupAssign,
    setHardcore: setHardcoreAssign,
    setSlowMode: setSlowModeAssign,
    playSound: playSoundAssign,
    playStatusSound: playStatusSound,
    handleFlipEnd: handleFlipEnd
}