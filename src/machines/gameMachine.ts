
import { assign, sendTo, setup } from 'xstate'

import { generateInitialGrid, generatePath } from '../utils/gameUtils';
import { GridValue } from '../types/GridValue';
import { LampStatus } from '../types/LampStatus';
import { ScorePopupProps } from '../types/ScorePopupProps';

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
}
 
type GameEvent =
    | { type: 'START' }
    | { type: 'DEMO_END' }
    | { type: 'MOVE'; direction: GridValue; nextPosition: { x: number; y: number } }
    | { type: 'SUCCESS_MOVE' }
    | { type: 'COMPLETE_PATH' }
    | { type: 'FAIL_MOVE' }
    | { type: 'RESET' }
    | { type: 'ADD_POPUP'; score: number }
    | { type: 'CLEAN_ARROW', position: { x: number; y: number } }
    | { type: 'REMOVE_POPUP'; id: string };


export const machine = setup({
    types: {
        context: { } as GameContext,
        events: { } as GameEvent
    },
    actions: {
        setupGame: assign(({ context }) => {
            const rows = 7;
            const cols = 7;
            const pathLength = context.pathLength;
            const path = generatePath(rows, cols, pathLength);
            const grid = generateInitialGrid(rows, cols, path);
            const startRoundTime = new Date();
            return { ...context, grid, currentPath: path, startRoundTime };
        }),
        initializeDemo: assign(({context}) => {
            return { ...context, currentIndex: 0, isDemoPlaying: true, status: 'demo' as LampStatus };
        }),
        cleanArrow: assign({
            grid: ({context, event}) => {
                if (event.type !== 'CLEAN_ARROW') return context.grid;
                const newGrid = context.grid.map(row => [...row]);
                if (!event.position) return newGrid;
                if (event.position?.y < 0 || event.position?.y >= newGrid.length || event.position?.x < 0 || event.position?.x >= newGrid[0].length) return newGrid;
                newGrid[event.position.y][event.position.x] = 'back';
                return newGrid;
            },
        }),          
        updateGrid: assign({
            grid: ({context, event}) => {
                if (event.type !== 'MOVE' ) return context.grid;
                const newGrid = context.grid.map(row => [...row]);
                newGrid[event.nextPosition.y][event.nextPosition.x] = event.direction;
                return newGrid;
            },
        }),
        incrementIndex: assign({
            currentIndex: ({context}) => context.currentIndex + 1
        }),
        applyPenalty: assign({
            score: ({context}) => {
                const maxScoreForPath = 100;
                const penaltyPercent = 25;
                const pathLengthFactor = Math.max(context.currentPath.length, 1);
            
                const penalty = (maxScoreForPath * penaltyPercent / 100) * pathLengthFactor;
                return Math.max(context.score - penalty, 0);
            },
            status: () => 'error' as LampStatus
        }),
        addPopup: assign({
            popups: ({context}) => {
                const newPopup = {
                    id: `${new Date().getTime()}`,
                    score: context.score,
                    top: `${context.currentPath[context.currentPath.length - 1].y * 100}px`,
                    left: `${context.currentPath[context.currentPath.length - 1].x * 100}px`,
                    onFadeComplete: () => { },
                };
                return [...context.popups, newPopup];
            },
        }),
        addPenaltyPopup: assign({
            popups: ({context}) => {
                console.log('ooops');
                
                const maxScoreForPath = 100;
                const penaltyPercent = 25;
                const pathLengthFactor = Math.max(context.currentPath.length, 1);
            
                const penalty = (maxScoreForPath * penaltyPercent / 100) * pathLengthFactor;
                const newPopup = {
                    id: `${new Date().getTime()}`,
                    score: -penalty,
                    top: `${context.currentPath[context.currentIndex].y * 100}px`,
                    left: `${context.currentPath[context.currentIndex].x * 100}px`,
                    onFadeComplete: () => { sendTo('REMOVE_POPUP', { id: newPopup.id }) },
                };
                return [...context.popups, newPopup];
            },
        }),
        decreaseDifficulty: assign({
            pathLength: ({context}) => Math.max(context.pathLength - 1, 3),
            demoDelay: ({context}) => Math.min(context.demoDelay + (context.demoDelay * 0.1), 500)
        }),
        calculateScore: assign({
            score: ({context}) => {
                console.log("calculateScore");
                
                if (!context.startRoundTime) return context.score;

                const endTime = new Date();
                const timeTaken = (endTime.getTime() - context.startRoundTime.getTime()) / 1000;
                const timeLimit = 10;
                const pathLengthFactor = Math.max(context.currentPath.length, 1);

                let newScore = Math.max((timeLimit - timeTaken) * (100 / timeLimit) / 2, 0);
                newScore *= pathLengthFactor;
                newScore = Math.floor(newScore);
            
                return context.score + newScore;
            },
        }),
        increaseDifficulty: assign({
            pathLength: ({context}) => Math.min(context.pathLength + 1, 15),
            demoDelay: ({context}) => Math.max(context.demoDelay * 0.9, 100),
            status: () => 'success' as LampStatus
        }),
        addScorePopup: assign({
            popups: ({context, event}) => {
              if (event.type !== 'ADD_POPUP') return context.popups;
          
              const newPopup: ScorePopupProps = {
                id: `${new Date().getTime()}`,
                score: event.score,
                top: `${context.currentPath[context.currentPath.length - 1].y * 100}px`,
                left: `${context.currentPath[context.currentPath.length - 1].x * 100}px`,
                onFadeComplete: () => {},
              };
          
              return [...context.popups, newPopup];
            },
        }),
        removeScorePopup: assign({
            popups: ({context}) => {
                const lastPopup = context.popups[context.popups.length - 1];
                if (!lastPopup) return context.popups;
                return context.popups.filter(popup => popup.id !== lastPopup.id);
            },
        }),
        playerTurn: assign({
            isDemoPlaying: () => false,
            startRoundTime: () => new Date(),
            status: () => 'yourTurn' as LampStatus
        })
    },
    guards: {
        isCorrectMove: function ({context, event}) {
            if (event.type !== 'MOVE') return false;
            return context.currentIndex + 1 < context.currentPath.length && 
                event.nextPosition.x === context.currentPath[context.currentIndex + 1].x && 
                event.nextPosition.y === context.currentPath[context.currentIndex + 1].y
        },
        hasCompletedPath: function ({context}) {
            return context.currentIndex + 1 === context.currentPath.length;
        }
    },
    schemas: {
        events: {
            START: {
                type: Object,
                properties: {}
            },
            DEMO_END: {
                type: Object,
                properties: {}
            },
            MOVE: {
                type: Object,
                properties: {}
            },
            RESET: {
                type: Object,
                properties: {}
            },
            ADD_POPUP: {
                type: Object,
                properties: {}
            },
            REMOVE_POPUP: {
                type: Object,
                properties: {}
            }
        },
        context: {
            grid: {
                type: Array,
                items: {
                    type: Array,
                    items: {
                        type: String
                    }
                }
            },
            currentPath: {
                type: Array,
                items: {
                    type: Object,
                    properties: {
                        x: {
                            type: Number
                        },
                        y: {
                            type: Number
                        }
                    }
                }
            },
            currentIndex: {
                type: Number
            },
            isDemoPlaying: {
                type: Boolean
            },
            score: {
                type: Number
            },
            pathLength: {
                type: Number
            },
            demoDelay: {
                type: Number
            },
            status: {
                type: String
            },
            popups: {
                type: Array,
                items: {
                    type: Object,
                    properties: {
                        id: {
                            type: String
                        },
                        score: {
                            type: Number
                        },
                        top: {
                            type: String
                        },
                        left: {
                            type: String
                        },
                        onFadeComplete: {
                            type: Function
                        }
                    }
                }
            },
            startRoundTime: {
                type: Object
            }
        },
    }
}).createMachine({
    context: {
        grid: [],
        currentPath: [],
        currentIndex: 0,
        isDemoPlaying: false,
        score: 0,
        pathLength: 3,
        demoDelay: 600,
        status: 'demo',
        popups: [],
        startRoundTime: null
    },
    id: 'game',
    initial: 'initial',
    on: {
        ADD_POPUP: {
            actions: { type: 'addScorePopup' }
        },
        REMOVE_POPUP: {
            actions: 'removeScorePopup'
        }
    },
    states: {
        demo: {
            entry: 'initializeDemo',
            on: { 
                DEMO_END: 'playing',
                MOVE: { actions: 'updateGrid' },
                RESET: 'initial',
                CLEAN_ARROW: { actions: 'cleanArrow' }
            }
        },
        initial: {
            entry: 'setupGame',
            after: {
                400: 'demo'
            }
        },
        playing: {
            entry: 'playerTurn',
            on: {
                MOVE: [
                    {   actions: ['updateGrid', 'incrementIndex'],
                        target: 'validateMove',
                        guard: 'isCorrectMove'
                    },
                    { target: 'failMove' }
                ],
                RESET: { target: 'initial' }
            }
        },
        validateMove: {
            always: [
                { target: 'successMove' },
                { target: 'failMove' }
            ]
        },
        successMove: {
            entry: ['updateGrid'],
            always: [
                {
                    target: 'completePath',
                    guard: 'hasCompletedPath'
                },
                { target: 'playing' }
            ],
        },
        failMove: {
            on: {
                RESET: { target: 'initial' },
                REMOVE_POPUP: { actions: 'removeScorePopup' }
            },
            entry: ['applyPenalty', 'addPenaltyPopup', 'decreaseDifficulty' ],
            after: {
                999: { actions: 'removeScorePopup' },
                1000: 'initial'
            }
        },
        completePath: {
            on: {
                RESET: { target: 'demo' },
                REMOVE_POPUP: { actions: 'removeScorePopup' }
            },
            entry: ['calculateScore', 'addPopup', 'increaseDifficulty'],
            after: {
                999: { actions: 'removeScorePopup' },
                1000: 'initial',
            }
        }
    }
});