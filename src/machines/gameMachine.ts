import { setup } from "xstate";
import { GridValue } from "../types/GridValue";
import { ScorePopupProps } from "../types/ScorePopupProps";
import { LampStatus } from "../types/LampStatus";
import { generateInitialGrid, generatePath } from "../utils/gameUtils";

type GameEvent =
  | { type: "START_GAME" }
  | { type: "MOVE"; direction: GridValue; x: number; y: number }
  | { type: "ADD_SCORE_POPUP"; score: number; top: string; left: string }
  | { type: "REMOVE_SCORE_POPUP"; id: string }
  | { type: "DEMO_FINISHED" }
  | { type: "USER_MOVED"; direction: GridValue; x: number; y: number }
  | { type: "NEXT_ROUND" }
  | { type: "RESET_GAME" };

type GameContext = {
  grid: GridValue[][];
  score: number;
  popups: ScorePopupProps[];
  status: LampStatus;
  isFreeze: boolean;
  demoDelay: number;
  pathLength: number;
  currentPath: { x: number; y: number }[];
  currentIndex: number;
  isDemoPlaying: boolean;
  startRoundTime: Date | null;
}

export const machineMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent
  },
  actions: {
    initializeGame: function ({ context }) {
      const path = generatePath(7, 7, context.pathLength);
      const initialGrid = generateInitialGrid(7, 7, path);
      context.grid = initialGrid;
      context.currentPath = path;
      context.currentIndex = 0;
      context.isDemoPlaying = true;
      context.startRoundTime = null;
    },
    updateUserMove: function ({ context, event }) {
      if (event.type === 'MOVE' || event.type === 'USER_MOVED') {
        const { x, y, direction } = event;
        if (context.grid && context.grid[y] && context.grid[y][x] !== undefined) {
          context.grid[y][x] = direction;
          context.currentIndex += 1;
        }
      }
    },
    calculateScore: function ({ context }) {
      if (context.startRoundTime) {
        const endTime = new Date();
        const timeTaken = (endTime.getTime() - context.startRoundTime.getTime()) / 1000;
        const timeLimit = 10;
        const pathLengthFactor = Math.max(context.currentPath.length, 1);
        let score = Math.max((timeLimit - timeTaken) * (100 / timeLimit) / 2, 0);
        score *= pathLengthFactor;
        context.score += Math.floor(score);
      }
    },
    addScorePopup: function ({ context, event }) {
      if (event.type === 'ADD_SCORE_POPUP') {
        const { score, top, left } = event;
        const newPopup = {
          id: `${new Date().getTime()}`,
          score,
          top,
          left,
          onFadeComplete: () => {/* Gérer la suppression ici si nécessaire */},
        };
        context.popups.push(newPopup);
      }
    },
    removeScorePopup: function ({ context, event }) {
      if (event.type === 'REMOVE_SCORE_POPUP') {
        const { id } = event;
        context.popups = context.popups.filter(popup => popup.id !== id);
      }
    },
  },
  guards: {
    isDemoPlaying: ({context}) => context.isDemoPlaying,
    isValidMove: function ({ context, event }) {
      if (event.type === 'USER_MOVED') {
        const expectedPosition = context.currentPath[context.currentIndex];
        return expectedPosition && event.x === expectedPosition.x && event.y === expectedPosition.y;
      } else {
        return false;
      }
    },
    isInvalidMove: function ({ context, event }) {
      if (event.type === 'USER_MOVED') {
        const expectedPosition = context.currentPath[context.currentIndex];
        return !(expectedPosition && event.x === expectedPosition.x && event.y === expectedPosition.y);
      } else {
        return false;
      }
    },
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
      isFreeze: {
        type: "boolean"
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
    isFreeze: false,
    demoDelay: 600,
    pathLength: 3,
    currentPath: [],
    currentIndex: 0,
    isDemoPlaying: false,
    startRoundTime: null,
  },
  id: "game",
  initial: "initializing",
  states: {
    initializing: {
      on: {
        START_GAME: 'loading'
      },
      entry: 'initializeGame'
    },
    loading: {
      on: {
        DEMO_FINISHED: 'playing'
      }
    },
    playing: {
      on: {
        MOVE: {
          actions: [
            {
              type: "updateUserMove",
            },
            {
              type: "calculateScore",
            },
          ],
        },
        ADD_SCORE_POPUP: {
          actions: {
            type: "addScorePopup",
          },
        },
        REMOVE_SCORE_POPUP: {
          actions: {
            type: "removeScorePopup",
          },
        },
      },
      always: {
        target: "demo",
        guard: {
          type: "isDemoPlaying",
        },
      },
    },
    demo: {
      on: {
        DEMO_FINISHED: {
          target: "waitingForMove",
        },
      },
    },
    waitingForMove: {
      on: {
        USER_MOVED: {
          target: "validatingMove",
        },
      },
    },
    validatingMove: {
      always: [
        {
          target: "success",
          guard: {
            type: "isValidMove",
          },
        },
        {
          target: "error",
          guard: {
            type: "isInvalidMove",
          },
        },
      ],
    },
    success: {
      on: {
        NEXT_ROUND: {
          target: "initializing",
        },
      },
    },
    error: {
      on: {
        RESET_GAME: {
          target: "initializing",
        },
      },
    },
  },
});