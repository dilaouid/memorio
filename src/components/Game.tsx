import React, { useState, useEffect, useCallback } from 'react';
// import useSound from 'use-sound';

import { Board } from './Board';
import { generateInitialGrid, generatePath, getArrowForPathSegment } from '../utils/gameUtils';

import useInterval from '../hooks/useInterval';
import { GridValue } from '../types/GridValue';

// je dois encore trouver ces fichiers plus tard
/* import startSound from '../assets/start.mp3';
import validSound from '../assets/valid.mp3';
import invalidSound from '../assets/invalid.mp3'; */

export const Game: React.FC = () => {
  const [grid, setGrid] = useState<(GridValue)[][]>([]);
  const [currentPath, setCurrentPath] = useState<{x: number, y: number}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [score, setScore] = useState(0);
  // const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('highScoreMemorio') || 0));
  const [gameOver, setGameOver] = useState(false);
  
  /* const [playStart] = useSound(startSound);
  const [playValid] = useSound(validSound);
  const [playInvalid] = useSound(invalidSound); */

  // Initialiser le jeu
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const path = generatePath(7, 2);
    const initialGrid = generateInitialGrid(7, 7, path); // Passez le chemin ici
    setGrid(initialGrid);
    setCurrentPath(path);
    setCurrentIndex(0);
    setIsDemoPlaying(true);
    setScore(0);
    setGameOver(false);
    // playStart();
    setTimeout(() => {
        playDemo(path, setGrid, setIsDemoPlaying);
    }, 1000);
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
          setGrid((prevGrid) => {
            const newGrid = prevGrid.map(row => [...row]);
            if (newGrid[nextSegment.y][nextSegment.x] !== 'start') {
              newGrid[nextSegment.y][nextSegment.x] = 'back';
            }
            return newGrid;
          });
        }, (demoIndex + 1) < path.length ? 500 : 600); // délai plus long pour delete derniere fleche
  
        demoIndex++;
  
        if (demoIndex < path.length) {
          setTimeout(showNextArrow, 250); // delai avant de montrer fleche suivante
        } else {
          setIsDemoPlaying(false);
        }
      }
    };
  
    showNextArrow();
  };

  

  // Gestion des touches du clavier
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (isDemoPlaying || gameOver) return; // Ne rien faire si la démo est en cours ou le jeu est terminé
    
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

    // vérifier si le mouvement est valide
    if (currentIndex + 1 < currentPath.length && 
        nextExpectedPosition.x === currentPath[currentIndex + 1].x && 
        nextExpectedPosition.y === currentPath[currentIndex + 1].y) {
      // c'est valide il peut bouger
      updateUserMoveOnGrid(nextExpectedPosition, direction);
      setCurrentIndex(currentIndex + 1);
      setScore(score + 1); // score + 1

      if (currentIndex + 1 === currentPath.length - 1) {
        // il a réussit !
        console.log("Chemin complété avec succès !");
        alert('nice')
        resetGame();
      }
    } else {
      // il a raté mdr
      console.log("Mouvement invalide !");
      alert('nope')
      resetGame();
    }
  }, [isDemoPlaying, gameOver, currentPath, currentIndex, score]);


  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useInterval(() => {
    if (isDemoPlaying) {
        
    }
  }, 1000);


  return (
    <div>
      <Board grid={grid} />

      { gameOver && <div>Game Over! Votre: {score}</div> }
    </div>
  );
};
