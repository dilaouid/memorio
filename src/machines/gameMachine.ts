import { assign, sendParent, setup } from "xstate";
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
  | { type: 'USER_MOVED'; direction: GridValue; x: number; y: number }
  | { type: "NEXT_ROUND" }
  | { type: "RESET_GAME" };

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

    playDemo: function ({ context }) {
      assign({ isDemoPlaying: true });
      const path = generatePath(7, 7, context.pathLength);

      const demoIndex = 1;
      const showNextArrow = () => {
        if (demoIndex < path.length) {
          const nextSegment = path[demoIndex];
          const currentSegment = path[demoIndex - 1];
          const direction = getArrowForPathSegment(currentSegment, nextSegment);
          assign({ grid: ({context}) => {
            const newGrid = context.grid.map((row: GridValue[]) => [...row]);
            newGrid[nextSegment.y][nextSegment.x] = direction;
            return newGrid;
          }})
        } else {
          sendParent({ type: 'DEMO_FINISHED' });
        }
      };
      showNextArrow();
    },

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
        if (event.type === 'MOVE' || event.type === 'USER_MOVED') {
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
      if (event.type !== 'MOVE' && event.type !== 'USER_MOVED') return false;
      const expectedPosition = context.currentPath[context.currentIndex];
      return expectedPosition && event.x === expectedPosition.x && event.y === expectedPosition.y;
    },
    isInvalidMove: function ({ context, event }) {
      if (event.type !== 'MOVE' && event.type !== 'USER_MOVED') return false;
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
      USER_MOVED: {
        type: "object",
        properties: {
          direction: { type: "string" },
          x: { type: "number" },
          y: { type: "number" }
        },    
      },
      NEXT_ROUND: {
        type: "object"
      },
      RESET_GAME: {
        type: "object"
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
      entry: ['initializing', 'playDemo'],
      on: {
        DEMO_FINISHED: { actions: assign({ isDemoPlaying: false }), target: "userTurn" },
        START_GAME: { target: "demo" },
      },
      after: {
        demoDelay: "userTurn",
      },
      exit: ['stopDemo'],
    },


    userTurn: {
      on: {
        MOVE: {
          target: 'checkingMove',
        },
        USER_MOVED: {
          actions: ["updateUserMove"],
        },
        NEXT_ROUND: 'demo',
        RESET_GAME: {
          target: 'demo',
          actions: 'initializing',
        },
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
        if (event.type !== 'MOVE' && event.type !== 'USER_MOVED') return;

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
    RESET_GAME: {
      target: '.initializing',
    },
  },
});