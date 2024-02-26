import React, { useEffect, useCallback } from 'react';
import { useMachine } from '@xstate/react';

import { machine } from '../machines/gameMachine';

import useSound from 'use-sound';

import { Board } from './Board';

import { GridValue } from '../types/GridValue';
import StatusLamp from './StatusLamp';
import ScorePopup from './ScorePopup';

import { startSound, flipSound, invalidSound, validSound } from '../assets/sfx/sounds';
import { getArrowForPathSegment } from '../utils/gameUtils';

export const Game: React.FC = () => {
  
  const [ state, send ] = useMachine(machine);
  const { grid, status, isDemoPlaying, currentIndex, currentPath, popups, score, demoDelay, pathLength } = state.context;


  useEffect(() => {
    if (state.value === 'demo') {
      let demoIndex = 1;
      const showNextArrow = () => {
        if (demoIndex < pathLength) {
          
          const currentSegment = currentPath[demoIndex - 1];
          const nextSegment = currentPath[demoIndex];
          const arrowDirection = getArrowForPathSegment(currentSegment, nextSegment);

          send({ type: 'MOVE', direction: arrowDirection, nextPosition: nextSegment });
          setTimeout(() => {
            send({ type: 'CLEAN_ARROW', position: nextSegment });
          }, demoDelay + (demoDelay / 10));
  
          demoIndex++;
          if (demoIndex < pathLength) {
            setTimeout(showNextArrow, demoDelay - (demoDelay / 2));
          } else {
            setTimeout(() => {
              send({ type: 'DEMO_END' });
            }, demoDelay + (demoDelay / 5));
          }  
        }
      };  
      showNextArrow();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.value, currentPath, demoDelay, pathLength]);
  

  const [playStart] = useSound(startSound);
  const [playValid] = useSound(validSound);
  const [playFlip] = useSound(flipSound);
  const [playInvalid] = useSound(invalidSound);

  // start the game
  useEffect(() => {

    switch (status) {
      case 'yourTurn':
        playStart();
        break;
      case 'error':
        playInvalid();
        break;
      case 'success':
        playValid();
        break;
      default:
        break;
    }
  }, [status, playStart, playValid, playInvalid]);

  // Gestion des touches du clavier
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (isDemoPlaying) return; // impossible de bouger
    
    let direction: GridValue | null = null;
    let moveDirection: { x: number, y: number } | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        direction = 'left';
        moveDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        direction = 'right';
        moveDirection = { x: 1, y: 0 };
        break;
      case 'ArrowUp':
        direction = 'top';
        moveDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        direction = 'bottom';
        moveDirection = { x: 0, y: 1 };
        break;
      default:
        return; // Si la touche pressée n'est pas une flèche ne rien faire
    }
  
    const lastConfirmedPosition = currentPath[currentIndex];
    const nextExpectedPosition = { 
      x: lastConfirmedPosition.x + moveDirection.x,
      y: lastConfirmedPosition.y + moveDirection.y
    };
    playFlip();
    
    send({ type: 'MOVE', direction, nextPosition: nextExpectedPosition });

  }, [send, currentIndex, currentPath, isDemoPlaying, playFlip]);


  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="game-container">
      <div className="score-display">Score: {score}</div>
      {isDemoPlaying && <div className="demo-blink">
        DEMO
      </div>}
      <Board grid={grid} />
      {popups.map(popup => (
        <ScorePopup key={popup.id} id={popup.id} score={popup.score} onFadeComplete={popup.onFadeComplete} top={popup.top} left={popup.left}  />
      ))}
      <StatusLamp status={status} />
    </div>
  );
};
