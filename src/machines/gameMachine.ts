
import { assign, setup } from 'xstate'
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


        // to change into a service since i use sendParent, but i don't know how.............. sad
        /* playDemo: ({context}) => {
            const { currentPath, demoDelay } = context;
            let demoIndex = 0;

            const showNextArrow = () => {
                if (demoIndex < currentPath.length - 1) {
                    const currentSegment = currentPath[demoIndex];
                    const nextSegment = currentPath[demoIndex + 1];
                    const arrowDirection = getArrowForPathSegment(currentSegment, nextSegment);

                    sendParent({ type: 'MOVE', direction: arrowDirection, nextPosition: nextSegment });
                    demoIndex++;
                    setTimeout(showNextArrow, demoDelay);
                } else {
                    sendParent({ type: 'DEMO_END' });
                }
            };
            showNextArrow();
        }, */
        updateGrid: assign({
            grid: ({context, event}) => {
                if (event.type !== 'MOVE') return context.grid;
                const newGrid = [...context.grid];
                newGrid[event.nextPosition.y][event.nextPosition.x] = event.direction;
                return newGrid;
            },
        }),
        applyPenalty: assign({
            score: ({context}) => {
                const maxScoreForPath = 100;
                const penaltyPercent = 25;
                const pathLengthFactor = Math.max(context.currentPath.length, 1);
            
                const penalty = (maxScoreForPath * penaltyPercent / 100) * pathLengthFactor;
                return Math.max(context.score - penalty, 0);
            },
        }),
        addPopup: assign({
            popups: ({context, event}) => {
                if (event.type !== 'ADD_POPUP') return context.popups;
                const newPopup = {
                    id: `${new Date().getTime()}`,
                    score: event.score,
                    top: `${context.currentPath[context.currentPath.length - 1].y * 100}px`,
                    left: `${context.currentPath[context.currentPath.length - 1].x * 100}px`,
                    onFadeComplete: () => {},
                };
                return [...context.popups, newPopup];
            },
        }),
        decreaseDifficulty: assign({
            pathLength: ({context}) => Math.max(context.pathLength - 1, 3),
            demoDelay: ({context}) => Math.min(context.demoDelay + (context.demoDelay * 0.1), 500),
        }),
        calculateScore: assign({
            score: ({context}) => {
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
            popups: ({context, event}) => {
              if (event.type !== 'REMOVE_POPUP') return context.popups;
              return context.popups.filter(popup => popup.id !== event.id);
            },
        })
    },
    guards: {
        isCorrectMove: function ({context, event}) {
            if (event.type !== 'MOVE') return false;
            const nextSegment = context.currentPath[context.currentIndex];
            return event.nextPosition.x === nextSegment.x && event.nextPosition.y === nextSegment.y;
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
        status: 'yourTurn',
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
            actions: { type: 'removeScorePopup' }
        }
    },
    states: {
        initial: {
            on: {
                START: { target: "demo" }
            },
            entry: { type: 'setupGame' }
        },
        playing: {
            on: {
                MOVE: [
                    {
                        target: 'successMove',
                        guard: { type: 'isCorrectMove' }
                    },
                    { target: 'failMove' }
                ],
                RESET: { target: 'initial' }
            }
        },
        successMove: {
            always: [
                {
                    target: 'completePath',
                    guard: { type: 'hasCompletedPath' }
                },
                { target: 'playing' }
            ],
            entry: { type: 'updateGrid' }
        },
        failMove: {
            on: {
                RESET: { target: 'initial' }
            },
            entry: [
                { type: 'applyPenalty' },
                { type: 'addPopup' },
                { type: 'decreaseDifficulty' }
            ]
        },
        completePath: {
        on: {
            RESET: { target: 'initial' }
        },
        entry: [
            { type: 'calculateScore' },
            { type: 'addPopup' },
            { type: 'increaseDifficulty' }
        ]
        }
    }
})
  