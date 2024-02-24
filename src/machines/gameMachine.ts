import { assign, fromPromise, setup } from "xstate";
import { GridValue } from "../types/GridValue";
import { ScorePopupProps } from "../types/ScorePopupProps";
import { LampStatus } from "../types/LampStatus";
import { generateInitialGrid, generatePath, getArrowForPathSegment } from "../utils/gameUtils";

type GameEvent =
  | { type: "START_GAME" }
  | { type: "MOVE"; direction: GridValue; x: number; y: number }
  | { type: "ADD_SCORE_POPUP"; score: number; top: string; left: string }
  | { type: "REMOVE_SCORE_POPUP"; id: string }
  | { type: "DEMO_FINISHED" }
  | { type: "UPDATE_GRID"; direction: GridValue; nextSegment: { x: number; y: number } };

type GameContext = {
  grid: GridValue[][];
  score: number;
  popups: ScorePopupProps[];
  status: LampStatus;
  demoDelay: number;
  pathLength: number;
  currentPath: { x: number; y: number }[];
  currentIndex: number;
  isDemoPlaying: boolean;
  startRoundTime: Date | null;
  path: { x: number; y: number }[];
}

export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent
  },
  actors: {
    demoService: fromPromise(async ({ input }: { input: { pathLength: number, demoDelay: number } }) => {
      console.log('Starting demo service');
      return new Promise((resolve) => {
        const path = generatePath(7, 7, input.pathLength);
        let demoIndex = 0;
        const showNextArrow = () => {
          if (demoIndex < path.length - 1) {
            const currentSegment = path[demoIndex];
            const nextSegment = path[demoIndex + 1];
            const direction = getArrowForPathSegment(currentSegment, nextSegment);
            resolve({ type: 'UPDATE_GRID', direction, nextSegment });
            demoIndex++;
            setTimeout(showNextArrow, input.demoDelay);
          } else {
            resolve('DEMO_FINISHED');
          }
        };
        showNextArrow();
      });
    })
  },
  actions: {

    decrementPathLength: assign({
      pathLength: ({ context }) => Math.max(context.pathLength - 1, 3),
    }),

    applyPenalty: assign({
      score: ({ context }) => Math.max(context.score - 10, 0),
    }),

    incrementPathLength: assign({
      pathLength: ({ context }) => context.pathLength + 1,
    }),

    resetForNextRound: assign({
      currentIndex: 0,
      startRoundTime: null,
    }),

    stopDemo: assign({ isDemoPlaying: false, status: "yourTurn" }),

    calculateScore: assign({
      score: ({ context }) => {
        if (context.startRoundTime) {
          const endTime = new Date();
          const timeTaken = (endTime.getTime() - context.startRoundTime.getTime()) / 1000;
          const timeLimit = 10;
          const pathLengthFactor = Math.max(context.currentPath.length, 1);
          let score = Math.max((timeLimit - timeTaken) * (100 / timeLimit) / 2, 0);
          score *= pathLengthFactor;
          return Math.floor(score);
        }
        return context.score;
      },
    }),

    updateUserMove: assign({
      grid: ({ context, event }) => {
        if (event.type === 'MOVE') {
          const { x, y, direction } = event;
          if (context.grid && context.grid[y] && context.grid[y][x] !== undefined) {
            context.grid[y][x] = direction;
          }
        }
        return context.grid;
      },
      currentIndex: ({ context }) => context.currentIndex + 1,
    }),

    initializing: function ({ context }) {
      const path = generatePath(7, 7, context.pathLength);
      const initialGrid = generateInitialGrid(7, 7, path);
      context.grid = initialGrid;
      context.currentPath = path;
      context.currentIndex = 0;
      context.isDemoPlaying = true;
      context.startRoundTime = null;
      context.status = "demo";
    },

    addScorePopup: function ({ context, event }) {
      if (event.type !== 'ADD_SCORE_POPUP') return {};
      const { score, top, left } = event;
      const newPopup = {
        id: `${new Date().getTime()}`,
        score,
        top,
        left,
        onFadeComplete: () => { },
      };
      context.popups.push(newPopup);
    },
    removeScorePopup: function ({ context, event }) {
      if (event.type !== 'REMOVE_SCORE_POPUP') return {};
      const { id } = event;
      context.popups = context.popups.filter(popup => popup.id !== id);
    },
  },
  guards: {
    isDemoPlaying: ({context}) => context.isDemoPlaying,
    completedPath: ({context}) => context.currentIndex === context.currentPath.length - 1,
    isValidMove: function ({ context, event }) {
      if (event.type !== 'MOVE') return false;
      const expectedPosition = context.currentPath[context.currentIndex];
      return expectedPosition && event.x === expectedPosition.x && event.y === expectedPosition.y;
    },
    isInvalidMove: function ({ context, event }) {
      if (event.type !== 'MOVE') return false;
      const expectedPosition = context.currentPath[context.currentIndex];
      return !(expectedPosition && event.x === expectedPosition.x && event.y === expectedPosition.y);
    }
  },
  schemas: {
    events: {
      START_GAME: {
        type: "object"
      },
      MOVE: {
        type: "object",
        properties: {
          direction: { type: "string" },
          x: { type: "number" },
          y: { type: "number" }
        }
      },
      ADD_SCORE_POPUP: {
        type: "object",
        properties: {
          score: { type: "number" },
          top: { type: "string" },
          left: { type: "string" }
        }
      },
      REMOVE_SCORE_POPUP: {
        type: "object",
        properties: {
          id: { type: "string" }
        },    
      },
      DEMO_FINISHED: {
        type: "object",
      },
      UPDATE_GRID: {
        type: "object",
        properties: {
          direction: { type: "string" },
          nextSegment: {
            type: "object",
            properties: {
              x: { type: "number" },
              y: { type: "number" }
            }
          }
        }
      },
    },
    context: {
      grid: {
        type: "array",
        items: {
          type: "string",
        }
      },
      score: {
        type: "number"
      },
      popups: {
        type: "array",
        items: {
          type: "string",
        }
      },
      status: {
        type: "string"
      },
      demoDelay: {
        type: "number"
      },
      pathLength: {
        type: "number"
      },
      currentPath: {
        type: "array",
        items: {
          type: "string",
        }
      },
      currentIndex: {
        type: "number"
      },
      isDemoPlaying: {
        type: "boolean"
      },
      startRoundTime: {
        type: "null"
      },
    },
  },
}).createMachine({
  context: {
    grid: [],
    score: 0,
    popups: [],
    status: "yourTurn",
    demoDelay: 600,
    pathLength: 3,
    currentPath: [],
    currentIndex: 0,
    isDemoPlaying: false,
    startRoundTime: null,
    path: [],
  },
  id: "game",
  initial: "initializing",
  states: {

    initializing: {
      always: 'demo',
      entry: assign(({context}) => {
        const path = generatePath(7, 7, context.pathLength);
        const initialGrid = generateInitialGrid(7, 7, path);
        return {
          grid: initialGrid,
          currentPath: path,
          currentIndex: 0,
          isDemoPlaying: true,
          startRoundTime: new Date(),
        };
      }),
      on: { START_GAME: "demo" },
      after: {
        600: "demo",
      },
    },
    
    checkingMove: {
      always: [
        { target: "success", guard: "completedPath" },
        { target: "error", guard: "isInvalidMove" },
        { target: "userTurn", guard: "isValidMove" },
      ],
    },

    demo: {
      invoke: {
        id: 'demoService',
        src: 'demoService',
        input: ({ context: { pathLength, demoDelay } }) => ({ pathLength, demoDelay }),
        onDone: {
          target: 'userTurn',
          actions: assign({ isDemoPlaying: false }),
        }
      },
      on: {
        UPDATE_GRID: {
          actions: assign({
            grid: ({context, event}) => {
              alert('pddpd')
              const newGrid = context.grid.map((row: GridValue[]) => [...row]);
              newGrid[event.nextSegment.y][event.nextSegment.x] = event.direction;
              return newGrid;
            },
          }),
        },
      }
    },

    userTurn: {
      on: {
        MOVE: {
          target: 'checkingMove',
          actions: ["updateUserMove"],
        }
      },
    },

    success: {
      entry: function ({context}) {
        const endTime = new Date();
        const timeTaken = context.startRoundTime ? (endTime.getTime() - context.startRoundTime.getTime()) / 1000 : 0;
        const score = Math.max(10 - timeTaken, 1) * context.pathLength * 10;
        const lastSegment = context.currentPath[context.currentPath.length - 1];
        context.popups.push({
          id: `${Date.now()}`,
          score: Math.round(score),
          top: `${lastSegment.y * 100}px`,
          left: `${lastSegment.x * 100}px`,
          onFadeComplete: () => {},
        });
        context.score += Math.round(score);
        context.pathLength += 1;
        context.status = "success";
        assign({ score: context.score, pathLength: context.pathLength, status: "success", popups: context.popups });
      },
      after: {
        1000: 'demo',
      },
    },

    error: {
      entry: function ({context, event}) {
        if (event.type !== 'MOVE') return;

        const maxScoreForPath = 100;
        const penaltyPercent = 25;
        const pathLengthFactor = Math.max(context.currentPath.length, 1);
    
        // Calcul de la pénalité
        const penalty = (maxScoreForPath * penaltyPercent / 100) * pathLengthFactor;

        const lastSegment = context.currentPath[context.currentIndex] || { x: 0, y: 0 };
        context.popups.push({
          id: `${Date.now()}`,
          score: penalty,
          top: `${lastSegment.y * 100}px`,
          left: `${lastSegment.x * 100}px`,
          onFadeComplete: () => {},
        });
        context.score = Math.max(context.score + penalty, 0);
        context.pathLength = Math.max(context.pathLength - 1, 3);
        context.status = "error";
      },
      after: {
        1000: 'demo',
      },
    },
  },
  on: {
    DEMO_FINISHED: {
      actions: assign({ isDemoPlaying: false }),
      target: '.userTurn',
    },
  },
});