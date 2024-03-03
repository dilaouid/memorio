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
    startedGame: boolean;
    muteMusic: boolean;
    savedDemoDelay: number;
    hardCoreDelay: number;
    isHardcoreMode: boolean;
    isSlowMode: boolean;
}
 
export type GameEvent =
    | { type: 'START' }
    | { type: 'DEMO_END' }
    | { type: 'MOVE'; direction: GridValue; nextPosition: { x: number; y: number } }
    | { type: 'SUCCESS_MOVE' }
    | { type: 'COMPLETE_PATH' }
    | { type: 'FAIL_MOVE' }
    | { type: 'ADD_POPUP'; score: number }
    | { type: 'CLEAN_ARROW', position: { x: number; y: number } }
    | { type: 'MUTE' }
    | { type: 'SET_HARD_MODE' }
    | { type: 'SET_SLOW_MODE' }
    | { type: 'REMOVE_POPUP'; id: string };