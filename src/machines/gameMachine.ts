import { assign, setup } from "xstate";

import { isValidMove } from "../utils/gameUtils";
import { GameContext, GameEvent } from "../types/Machine";
import { actions } from "./actions";

const env = import.meta.env;

export const machine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
  actions: {
    setupGame: assign(({ context }) => actions.setup(context)),
    initializeDemo: assign(({ context }) => actions.initialize(context)),
    cleanArrow: assign({
      grid: ({ context, event }) => actions.cleanArrow(context, event),
    }),
    updateGrid: assign({
      grid: ({ context, event }) => actions.updateGrid(context, event),
    }),
    incrementIndex: assign({
      currentIndex: ({ context }) => context.currentIndex + 1,
    }),
    applyPenalty: assign(({ context }) => actions.penalty(context)),
    winSchema: assign(({ context }) => actions.win(context)),
    removeScorePopup: assign(({ context }) => actions.removePopup(context)),
    playerTurn: assign(() => actions.playerTurn()),
    setHardcore: assign(({ context }) => actions.setHardcore(context)),
    setSlowMode: assign(({ context }) => actions.setSlowMode(context)),
  },
  guards: {
    isCorrectMove: function ({ context, event }) {
      if (event.type !== "MOVE") return false;
      return isValidMove(context, event);
    },
    hasCompletedPath: function ({ context }) {
      return context.currentIndex + 1 === context.currentPath.length;
    },
  },
}).createMachine({
  context: {
    grid: [], // This will be a 2D array of strings.
    currentPath: [], // This will be an array of objects with x and y properties.
    currentIndex: 0, // This will be a number representing the current index in the path.
    isDemoPlaying: false,
    score: 0,
    pathLength: Number(env.VITE_DEFAUT_PATHLENGTH), // This will be a number representing the length of the path (used for difficulty).
    demoDelay: Number(env.VITE_DEFAUT_DEMO_DELAY), // This will be a number representing the time for the demo to play (the larger the number, the slower the demo will play).
    status: "demo", // the status for the lamp (demo, playing, success, error).
    popups: [], // This will be an array of objects with id, score, top, and left properties, this is the popup playing to tell if you lose or win points.
    startRoundTime: null, // This will be a number representing the time when the round started, to use a chronometer for the points
    startedGame: false,
    muteMusic: false,
    savedDemoDelay: Number(env.VITE_DEFAUT_DEMO_DELAY),
    hardCoreDelay: Number(env.VITE_HARDCORE_DELAY),
    isHardcoreMode: false,
    isSlowMode: false,
  },
  id: "game",
  initial: "menu",
  on: {
    ADD_POPUP: {
      actions: "winSchema"
    },
    REMOVE_POPUP: {
      actions: "removeScorePopup"
    },
    MUTE: {
      actions: assign({ muteMusic: ({context}) => !context.muteMusic })
    },
    SET_HARD_MODE: {
      actions: "setHardcore"
    },
    SET_SLOW_MODE: {
      actions: "setSlowMode"
    },
  },
  states: {
    demo: {
      entry: "initializeDemo",
      on: {
        DEMO_END: "playing",
        MOVE: { actions: "updateGrid" },
        CLEAN_ARROW: { actions: "cleanArrow" },
      },
    },
    menu: {
      on: {
        START: { target: "initial" },
      },
    },
    initial: {
      entry: "setupGame",
      after: { 400: "demo" },
    },
    playing: {
      entry: "playerTurn",
      on: {
        MOVE: [
          {
            actions: ["updateGrid", "incrementIndex"],
            target: "validateMove",
            guard: "isCorrectMove",
          },
          { target: "failMove" },
        ],
      },
    },
    validateMove: {
      always: [{ target: "successMove" }, { target: "failMove" }],
    },
    successMove: {
      entry: ["updateGrid"],
      always: [
        {
          target: "completePath",
          guard: "hasCompletedPath",
        },
        { target: "playing" },
      ],
    },
    failMove: {
      on: {
        REMOVE_POPUP: { actions: "removeScorePopup" },
      },
      entry: ["updateGrid", "applyPenalty"],
      after: {
        999: { actions: "removeScorePopup" },
        1000: "initial",
      },
    },
    completePath: {
      on: {
        REMOVE_POPUP: { actions: "removeScorePopup" },
      },
      entry: "winSchema",
      after: {
        999: { actions: "removeScorePopup" },
        1000: "initial",
      },
    },
  },
});
