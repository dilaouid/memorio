import React, { useEffect, useCallback } from "react";
import { useMachine } from "@xstate/react";

import { machine } from "../machines/gameMachine";

import useSound from "use-sound";

import { Board } from "./Board";

import { GridValue } from "../types/GridValue";
import StatusLamp from "./StatusLamp";
import ScorePopup from "./ScorePopup";
import { Menu } from "./Menu/Menu";

import {
  startSound,
  flipSound,
  invalidSound,
  validSound,
} from "../assets/sfx/sounds";
import { getArrowForPathSegment, setInitialDemoIndex } from "../utils/gameUtils";
import { MuteMusic } from "./MuteMusic";
import { Difficulty } from "./Difficulty";
import { Score } from "./Score";

interface GameProps {
  playBGMGame: () => void;
  stopBGMGame: () => void;
  stopBGMMenu: () => void;
  playBGMMenu: () => void;
}

export const Game: React.FC<GameProps> = ({ playBGMGame, stopBGMMenu, stopBGMGame, playBGMMenu }) => {
  const [state, send] = useMachine(machine);
  const {
    grid,
    status,
    isDemoPlaying,
    currentIndex,
    currentPath,
    popups,
    score,
    demoDelay,
    pathLength,
    startedGame,
    muteMusic,
    isHardcoreMode,
    isSlowMode
  } = state.context;
  const gridSize = import.meta.env.VITE_GRID_SIZE as number;

  const [playStart] = useSound(startSound);
  const [playValid] = useSound(validSound);
  const [playFlip] = useSound(flipSound);
  const [playInvalid] = useSound(invalidSound);


  useEffect(() => {
    if (startedGame && !muteMusic) {
      playBGMGame();
      stopBGMMenu();
    } else if (startedGame && muteMusic) {
      stopBGMGame();
    } else if (!startedGame && !muteMusic) {
      playBGMMenu();
    } else if (!startedGame && muteMusic) {
      stopBGMMenu();
    } else {
      stopBGMGame();
      stopBGMMenu();
    }
  }, [startedGame, playBGMGame, stopBGMMenu, muteMusic, stopBGMGame, playBGMMenu]);

  useEffect(() => {
    if (state.value === "demo") {
      let demoIndex = setInitialDemoIndex({ currentPath, isHardcoreMode, pathLength });
      const showNextArrow = () => {
        const condition = isHardcoreMode ? demoIndex >= 1 : demoIndex < pathLength;
        if (condition) {
          const currentSegment = currentPath[demoIndex - 1];
          const nextSegment = currentPath[demoIndex];
          if (nextSegment && currentSegment) {
            const arrowDirection = getArrowForPathSegment(
              currentSegment,
              nextSegment
            );
            send({
              type: "MOVE",
              direction: arrowDirection,
              nextPosition: nextSegment,
            });
          }

          if (!nextSegment && condition) {
            send({ type: "CLEAN_ARROW", position: currentSegment });
            send({ type: "CLEAN_ARROW", position: currentPath[demoIndex] });
            send({ type: "CLEAN_ARROW", position: currentPath[demoIndex - 2] });

            send({ type: "DEMO_END" });
            return;
          }

          setTimeout(() => {
            send({ type: "CLEAN_ARROW", position: nextSegment });
          }, demoDelay + demoDelay / 10);

          demoIndex = isHardcoreMode ? demoIndex - 1 : demoIndex + 1;
          if (isHardcoreMode ? demoIndex >= 1 : demoIndex < pathLength) {
            setTimeout(showNextArrow, demoDelay - demoDelay / 2);
          } else {
            setTimeout(() => {
              send({ type: "DEMO_END" });
            }, demoDelay + demoDelay / 5);
          }
        } else {
          send({ type: "DEMO_END" });
        }
      };
      showNextArrow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.value, currentPath, demoDelay, pathLength]);

  // start the game
  useEffect(() => {
    switch (status) {
      case "yourTurn":
        playStart();
        break;
      case "error":
        playInvalid();
        break;
      case "success":
        playValid();
        break;
      default:
        break;
    }
  }, [status, playStart, playValid, playInvalid]);

  // Gestion des touches du clavier
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (isDemoPlaying || status == "success" || status == "error") return; // impossible de bouger

      let direction: GridValue | null = null;
      let moveDirection: { x: number; y: number } | null = null;

      switch (event.key) {
        case "ArrowLeft":
          direction = "left";
          moveDirection = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          direction = "right";
          moveDirection = { x: 1, y: 0 };
          break;
        case "ArrowUp":
          direction = "top";
          moveDirection = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          direction = "bottom";
          moveDirection = { x: 0, y: 1 };
          break;
        default:
          return; // Si la touche pressée n'est pas une flèche ne rien faire
      }

      const lastConfirmedPosition = currentPath[currentIndex];
      const nextExpectedPosition = {
        x: lastConfirmedPosition.x + moveDirection.x,
        y: lastConfirmedPosition.y + moveDirection.y,
      };

      if (
        (nextExpectedPosition.x === currentPath[0].x &&
          nextExpectedPosition.y === currentPath[0].y) ||
        nextExpectedPosition.x > gridSize - 1 ||
        nextExpectedPosition.x < 0 ||
        nextExpectedPosition.y > gridSize - 1 ||
        nextExpectedPosition.y < 0
      )
        return;

      playFlip();

      send({ type: "MOVE", direction, nextPosition: nextExpectedPosition });
    },
    [send, currentIndex, currentPath, isDemoPlaying, playFlip, status, gridSize]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="game-container">
      { startedGame && <Difficulty send={send} isHardcoreMode={isHardcoreMode} isSlowMode={isSlowMode} isDemoPlaying={isDemoPlaying} /> }
      <MuteMusic send={send} muteMusic={muteMusic} />
      { !startedGame && <Menu send={send} /> }
      { startedGame && <div>
        <Score isHardcoreMode={isHardcoreMode} isSlowMode={isSlowMode} score={score} />
        {isDemoPlaying && <div className="demo-blink">DEMO</div>}
        <Board grid={grid} />
        {popups.map((popup) => (
          <ScorePopup
            key={popup.id}
            id={popup.id}
            score={popup.score}
            top={popup.top}
            left={popup.left}
          />
        ))}
        <StatusLamp status={status} gridSize={gridSize} />
      </div> }
    </div>
  );
};
