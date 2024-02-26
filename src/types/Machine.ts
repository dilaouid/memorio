import { GridValue } from "../types/GridValue";
import { LampStatus } from "../types/LampStatus";
import { ScorePopupProps } from "../types/ScorePopupProps";

export interface GameContext {
    grid: GridValue[][];
    currentPath: { x: number; y: number }[];
    currentIndex: number;
    isDemoPlaying: boolean;
    score: number;
    pathLength: number;
    demoDelay: number;
    status: LampStatus;
    popups: ScorePopupProps[];
    startRoundTime: Date | null;
}
 
export type GameEvent =
    | { type: 'DEMO_END' }
    | { type: 'MOVE'; direction: GridValue; nextPosition: { x: number; y: number } }
    | { type: 'SUCCESS_MOVE' }
    | { type: 'COMPLETE_PATH' }
    | { type: 'FAIL_MOVE' }
    | { type: 'ADD_POPUP'; score: number }
    | { type: 'CLEAN_ARROW', position: { x: number; y: number } }
    | { type: 'REMOVE_POPUP'; id: string };