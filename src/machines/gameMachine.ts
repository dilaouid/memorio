import { assign, setup } from 'xstate'

import { isValidMove } from '../utils/gameUtils';
import { GameContext, GameEvent } from '../types/Machine'
import { actions } from './actions';

const env = import.meta.env;


export const machine = setup({
    types: {
        context: { } as GameContext,
        events: { } as GameEvent
    },
    actions: {
        setupGame: assign(({ context }) =>  actions.setup(context) ),
        initializeDemo: assign(({context}) => actions.initialize(context) ),
        cleanArrow: assign({
            grid: ({context, event}) => actions.cleanArrow(context, event)
        }),          
        updateGrid: assign({
            grid: ({context, event}) => actions.updateGrid(context, event)
        }),
        incrementIndex: assign({
            currentIndex: ({context}) => context.currentIndex + 1
        }),
        applyPenalty: assign(({context}) => actions.penalty(context)),
        winSchema: assign(({context}) => actions.win(context)),
        removeScorePopup: assign(({context}) => actions.removePopup(context)),
        playerTurn: assign(() => actions.playerTurn()),
    },
    guards: {
        isCorrectMove: function ({context, event}) {
            if (event.type !== 'MOVE') return false;
            return isValidMove(context, event)
        },
        hasCompletedPath: function ({context}) {
            return context.currentIndex + 1 === context.currentPath.length;
        }
    }
}).createMachine({
    context: {
        grid: [],
        currentPath: [],
        currentIndex: 0,
        isDemoPlaying: false,
        score: 0,
        pathLength: Number(env.VITE_DEFAUT_PATHLENGTH),
        demoDelay: Number(env.VITE_DEFAUT_DEMO_DELAY),
        status: 'demo',
        popups: [],
        startRoundTime: null
    },
    id: 'game',
    initial: 'initial',
    on: {
        ADD_POPUP: {
            actions: 'winSchema'
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
                CLEAN_ARROW: { actions: 'cleanArrow' }
            }
        },
        initial: {
            entry: 'setupGame',
            after: { 400: 'demo' }
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
                ]
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
                REMOVE_POPUP: { actions: 'removeScorePopup' }
            },
            entry: ['updateGrid', 'applyPenalty' ],
            after: {
                999: { actions: 'removeScorePopup' },
                1000: 'initial'
            }
        },
        completePath: {
            on: {
                REMOVE_POPUP: { actions: 'removeScorePopup' }
            },
            entry: 'winSchema',
            after: {
                999: { actions: 'removeScorePopup' },
                1000: 'initial',
            }
        }
    }
});