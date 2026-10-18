import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";

import { machine } from "@machines/gameMachine";

import { Board } from "@components/Board";

import StatusLamp from "@components/StatusLamp";
import ScorePopup from "@components/ScorePopup";
import { Menu } from "@components/Menu/Menu";

import { getArrowForPathSegment, setInitialDemoIndex } from "@utils/gameUtils";
import { MuteMusic } from "@components/MuteMusic";
import { Difficulty } from "@components/Difficulty";
import { Score } from "@components/Score";
import { PressureGauge } from "@components/PressureGauge";
import { GameOver } from "@components/GameOver";
import { sounds } from "@assets/sfx/sounds";

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
    currentPath,
    popups,
    score,
    bestScore,
    lives,
    streak,
    level,
    startRoundTime,
    demoDelay,
    pathLength,
    startedGame,
    muteMusic,
    isHardcoreMode,
    isSlowMode
  } = state.context;
  const isGameOver = state.matches("gameOver");
  const isMenu = state.matches("menu");

  // Enter starts the game from the menu, or restarts it after a game over.
  useEffect(() => {
    if (!isMenu && !isGameOver) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.repeat) return;
      event.preventDefault();
      send({ type: isMenu ? "START" : "RESTART" });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isMenu, isGameOver, send]);

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
              send({ type: "PLAY_SOUND", audioUrl: sounds.start });
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

  return (
    <div className="game-container">
      { startedGame && <Difficulty send={send} isHardcoreMode={isHardcoreMode} isSlowMode={isSlowMode} isDemoPlaying={isDemoPlaying} /> }
      <MuteMusic send={send} muteMusic={muteMusic} />
      { !startedGame && <Menu send={send} bestScore={bestScore} /> }
      { startedGame && <div className="play-area">
        <Score
          isHardcoreMode={isHardcoreMode}
          isSlowMode={isSlowMode}
          score={score}
          bestScore={bestScore}
          level={level}
          lives={lives}
          streak={streak}
        />
        <div className="board-row">
          <div className={`board-frame status-${status}`}>
            {isDemoPlaying && <div className="demo-blink">Watch</div>}
            {status === "yourTurn" && <div className="demo-blink your-turn">Your turn</div>}
            <Board grid={grid} />
            {popups.map((popup) => (
              <ScorePopup
                key={popup.id}
                id={popup.id}
                score={popup.score}
                label={popup.label}
                top={popup.top}
                left={popup.left}
              />
            ))}
          </div>
          <div className="side-panel">
            <PressureGauge active={status === "yourTurn"} startRoundTime={startRoundTime} />
            <StatusLamp status={status} />
          </div>
        </div>
        { isGameOver && <GameOver send={send} score={score} bestScore={bestScore} level={level} /> }
      </div> }
    </div>
  );
};
