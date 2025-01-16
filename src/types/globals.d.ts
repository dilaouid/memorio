declare global {
    type GridValue = "back" | "start" | "left" | "right" | "top" | "bottom" | "fail" | "success";
    type LampStatus = 'demo' | 'error' | 'success' | 'yourTurn';
    type ScorePopupProps = {
        id: string;
        score: number;
        top: string;
        left: string;
    };

    interface GameContext {
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
        flippedTiles: { x: number; y: number }[];
        demoFlipQueue: { x: number; y: number, type: GridValue }[];
        isFlipping: boolean,
    }

    type GameEvent =
        | { type: 'START' }
        | { type: 'DEMO_END' }
        | { type: 'MOVE'; direction: GridValue; nextPosition: { x: number; y: number } }
        | { type: "TILE_FLIP_END"; x: number; y: number }
        | { type: 'SUCCESS_MOVE' }
        | { type: 'COMPLETE_PATH' }
        | { type: 'FAIL_MOVE' }
        | { type: 'ADD_POPUP'; score: number }
        | { type: 'CLEAN_ARROW', position: { x: number; y: number } }
        | { type: 'MUTE' }
        | { type: 'SET_HARD_MODE' }
        | { type: 'SET_SLOW_MODE' }
        | { type: "PLAY_SOUND"; audioUrl: string }
        | { type: "TILE_CLICK"; position: { x: number; y: number } }
        | { type: 'REMOVE_POPUP'; id: string };


}

export {}