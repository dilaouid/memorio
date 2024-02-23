import React, { useState, useEffect, useCallback } from 'react';
import useSound from 'use-sound';

import { Board } from './Board';
import { generateInitialGrid, generatePath, getArrowForPathSegment } from '../utils/gameUtils';

import { GridValue } from '../types/GridValue';
import { LampStatus } from '../types/LampStatus';
import StatusLamp from './StatusLamp';
import { ScorePopupProps } from '../types/ScorePopupProps';
import ScorePopup from './ScorePopup';

// je dois encore trouver ces fichiers plus tard
import startSound from '../assets/sfx/start.wav';
import validSound from '../assets/sfx/valid.wav';
import flipSound from '../assets/sfx/flip.wav';
import invalidSound from '../assets/sfx/invalid.wav';

export const Game: React.FC = () => {
  const [grid, setGrid] = useState<(GridValue)[][]>([]);
  const [currentPath, setCurrentPath] = useState<{x: number, y: number}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [score, setScore] = useState(0);
  // const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('highScoreMemorio') || 0));
  const [gameOver, setGameOver] = useState(false);
  const [pathLength, setPathLength] = useState(3);
  const [demoDelay, setDemoDelay] = useState(600);
  const [status, setStatus] = useState<LampStatus>('yourTurn');
  const [isFreeze, setIsFreeze] = useState(false);

  const [startRoundTime, setStartRoundTime] = useState<Date | null>(null);

  const [popups, setPopups] = useState<ScorePopupProps[]>([]);
  
  const [playStart] = useSound(startSound);
  const [playValid] = useSound(validSound);
  const [playFlip] = useSound(flipSound);
  const [playInvalid] = useSound(invalidSound);

  // Initialiser le jeu
  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (!isDemoPlaying) {
      setStartRoundTime(new Date());
      setStatus('yourTurn');
    } else {
      setStatus('demo');
    }
  }, [isDemoPlaying]);

  useEffect(() => {
    if (status === 'demo' || status === 'success' || status === 'error') {
      setIsFreeze(true);
    } else {
      playStart();
      const timer = setTimeout(() => {
        setIsFreeze(false)
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const resetGame = () => {
    const path = generatePath(7, 7, pathLength);
    const initialGrid = generateInitialGrid(7, 7, path);
    setStartRoundTime(null);
    setGrid(initialGrid);
    setCurrentPath(path);
    setCurrentIndex(0);
    setIsDemoPlaying(true);
    setGameOver(false);
    // playStart();
    setTimeout(() => {
        playDemo(path, setGrid, setIsDemoPlaying);
    }, demoDelay);
  };

  const calculateScore = () => {
    if (!startRoundTime) return 0;

    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startRoundTime.getTime()) / 1000;
    const timeLimit = 10;
    const pathLengthFactor = Math.max(currentPath.length, 1); // prendre en compte la longueur du chemin

    // calcul du score en fonction du temps restant et de la longueur du chemin
    let score = Math.max((timeLimit - timeTaken) * (100 / timeLimit) / 2, 0);
    score *= pathLengthFactor;
    score = Math.floor(score);

    console.log(`Score for this round: ${score}`);
    return score;
  };

  const failPenalty = () => {
    const maxScoreForPath = 100;
    const penaltyPercent = 25;
    const pathLengthFactor = Math.max(currentPath.length, 1);
    
    // Calcul de la pénalité
    let penalty = (maxScoreForPath * penaltyPercent / 100) * pathLengthFactor;
  
    console.log(`Penalty for this round: -${penalty}`);
    return penalty;
  };

  const addScorePopup = (score: number) => {
    const top = `${Math.random() * 100}%`;
    const left = `${Math.random() * 100}%`;

    const newPopup: ScorePopupProps = {
      id: `${new Date().getTime()}`,
      score,
      top,
      left,
      onFadeComplete: removeScorePopup,
    };
    setPopups((prevPopups) => [...prevPopups, newPopup]);
  };
  
  const removeScorePopup = (id: string) => {
    setPopups((prevPopups) => prevPopups.filter(popup => popup.id !== id));
  };

  const updateUserMoveOnGrid = useCallback((nextPosition: { x: number, y: number }, direction: GridValue) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[nextPosition.y][nextPosition.x] = direction;
      return newGrid;
    });
  }, [setGrid]);

  const playDemo = (
    path: {x: number, y: number}[],
    setGrid: React.Dispatch<React.SetStateAction<GridValue[][]>>,
    setIsDemoPlaying: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setIsDemoPlaying(true);
    let demoIndex = 1;
  
    const showNextArrow = () => {
      if (demoIndex < path.length) {
        const currentSegment = path[demoIndex - 1];
        const nextSegment = path[demoIndex];
        const arrowImage = getArrowForPathSegment(currentSegment, nextSegment);
  
        // Montrer la flèche actuelle
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map(row => [...row]);
          newGrid[nextSegment.y][nextSegment.x] = arrowImage;
          return newGrid;
        });
  
        setTimeout(() => {
          
          setTimeout(() => {
            setGrid((prevGrid) => {
              const newGrid = prevGrid.map(row => [...row]);
              if (newGrid[nextSegment.y][nextSegment.x] !== 'start') {
                newGrid[nextSegment.y][nextSegment.x] = 'back';
              } return newGrid;
            });
          }, demoDelay + (demoDelay / 10));
          
          demoIndex++;
          if (demoIndex < path.length) {
            setTimeout(showNextArrow, demoDelay - (demoDelay / 2));
          } else {
            setTimeout(() => {
              setIsDemoPlaying(false);
            }, demoDelay + (demoDelay / 5));
          }
        }, demoDelay / 2);
      }
   };
    showNextArrow();
  };

  

  // Gestion des touches du clavier
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (isDemoPlaying || gameOver || isFreeze) return; // impossible de bouger
    
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


    const random = Math.random();
    // vérifier si le mouvement est valide
    if (currentIndex + 1 < currentPath.length && 
        nextExpectedPosition.x === currentPath[currentIndex + 1].x && 
        nextExpectedPosition.y === currentPath[currentIndex + 1].y) {
      // c'est valide il peut bouger
      playFlip();
      updateUserMoveOnGrid(nextExpectedPosition, direction);
      setCurrentIndex(currentIndex + 1);

      if (currentIndex + 1 === currentPath.length - 1) {
        // il a réussit !
        const roundScore = calculateScore();
        addScorePopup(roundScore) 
        setScore(prevScore => prevScore + roundScore);

        console.log(`Score: ${score}`);

        // une chance sur 3 d'augmenter le speed pathLength de 1, 2 chances sur 3 de le laisser tel quel
        if (random < 0.33) {
          setDemoDelay(prevDelay => Math.max(prevDelay * .9, 100)); // accélérer la démo
          setPathLength(prevLength => Math.min(prevLength + 1, 15));
        }

        setStatus('success');
        playValid();
        setTimeout(() => {
          resetGame();
        }, 800);
      }
    } else {
      // il a raté mdr

      // vérifier si la position jouée est bien dans la grid pour dessiner la flèche
      if (nextExpectedPosition.x >= 0 && nextExpectedPosition.x < 7 && nextExpectedPosition.y >= 0 && nextExpectedPosition.y < 7) {
        direction = 'fail';
        updateUserMoveOnGrid(nextExpectedPosition, direction);
      }

      setPathLength(prevLength => Math.max(prevLength - 1, 3));
      const roundPenalty = failPenalty();

      addScorePopup(-roundPenalty);
      setScore((prevScore) => Math.max(prevScore - roundPenalty, 0));
      console.log(`Total score after penalty: ${score - roundPenalty}`);
      
      // une chance sur 3 de reduire le speed
      if (random < 0.33)
        setDemoDelay(prevDelay => Math.min(prevDelay + (prevDelay * .9), 500)); // ralentir la démo
      setStatus('error');
      playInvalid();
      setTimeout(() => {
        resetGame();
      }, 800); 
    }
  }, [isDemoPlaying, gameOver, currentPath, currentIndex, score, isFreeze]);


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
      { gameOver && <div>Game Over! Votre: {score}</div> }
    </div>
  );
};
