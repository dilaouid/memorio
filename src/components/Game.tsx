import React, { useState, useEffect, useCallback } from 'react';
import useSound from 'use-sound';

import { Board } from './Board';
import { generateInitialGrid, generatePath, validateMove } from '../utils/gameUtils';

import useInterval from '../hooks/useInterval';

// je dois encore trouver ces fichiers plus tard
import startSound from '../assets/start.mp3';
import validSound from '../assets/valid.mp3';
import invalidSound from '../assets/invalid.mp3';

export const Game: React.FC = () => {
  const [grid, setGrid] = useState<(string)[][]>([]);
  const [currentPath, setCurrentPath] = useState<{x: number, y: number}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('highScoreMemorio') || 0));
  const [gameOver, setGameOver] = useState(false);
  
  const [playStart] = useSound(startSound);
  const [playValid] = useSound(validSound);
  const [playInvalid] = useSound(invalidSound);

  // Initialiser le jeu
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const initialGrid = generateInitialGrid(10, 10);
    setGrid(initialGrid);
    const path = generatePath(10, 10);
    setCurrentPath(path);
    setCurrentIndex(0);
    setIsDemoPlaying(true);
    setScore(0);
    setGameOver(false);
    playStart();
    setTimeout(() => {
      playDemo(path);
    }, 1000);
  };

  const playDemo = (path: {x: number, y: number}[]) => {
    

  };

  // Gestion des touches du clavier
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (isDemoPlaying) return;
    
  }, [isDemoPlaying, currentPath, currentIndex]);

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
