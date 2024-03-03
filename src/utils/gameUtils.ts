import { GridValue } from "../types/GridValue";

const gridLength = import.meta.env.VITE_GRID_SIZE;

type EmptyGrid = ('back' | 'start')[][];

/**
 * Génère un plateau de jeu initial rempli des cases non révélées
 * @param path Le chemin à générer
 * @returns Un tableau 2D initialisé avec 'back' pour toutes les cases
*/
export const generateInitialGrid = (path: {x: number, y: number}[]): ('back' | 'start')[][] => {
    const grid: EmptyGrid = Array.from({ length: gridLength }, () => Array.from({ length: gridLength }, () => 'back'));

    const startX = path[0].x;
    const startY = path[0].y;
    grid[startY][startX] = 'start';

    return grid;
};
  

/**
 * Sélectionne une case de départ aléatoire et génère un chemin à partir de celle-ci
 * @param pathLength La longueur du chemin à générer
 * @returns Le chemin généré sous forme d'une liste de coordonnées {x, y}
*/
export const generatePath = (pathLength: number): {x: number, y: number}[] => {
    // on commence par faire le start du chemin
    const start = Math.floor(Math.random() * gridLength);
    const path = [{x: start, y: start}];
  
    // Générer un chemin aléatoire
    let currentX: number = start, currentY = start;
  
    const getValidMoves = (currentX: number, currentY: number, path: {x: number, y: number}[]) => {
      const directions = [
        { x: 0, y: -1 }, // haut
        { x: 1, y: 0 }, // droite
        { x: 0, y: 1 }, // bas
        { x: -1, y: 0 } // gauche
      ];
  
      return directions
        .map(dir => ({ x: currentX + dir.x, y: currentY + dir.y }))
        .filter(pos => 
          pos.x >= 0 && pos.x < gridLength &&
          pos.y >= 0 && pos.y < gridLength &&
          !path.some(p => p.x === pos.x && p.y === pos.y) // ne pas reproduire les pas précédents
        );
    };
  
    while (path.length < pathLength) {
      const validMoves = getValidMoves(currentX, currentY, path);
      if (validMoves.length === 0) {
        break; // dès que c'est plus possbiel on arrête
      }

      // en attendant, on choisit un mouvement random
      const nextMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      path.push(nextMove);
      currentX = nextMove.x;
      currentY = nextMove.y;
    }
  
    return path;
};
  
/**
 * Valide si le mouvement du joueur est conforme au chemin généré
 * @param currentPath Le chemin généré que le joueur doit suivrz
 * @param playerMove Le mouvement du joueur à valider
 * @param currentIndex L'indice du mouvement actuel dans le chemin
 * @returns bool indiquant si le mouvement est valide
*/
export const validateMove = (
    currentPath: {x: number, y: number}[],
    playerMove: {x: number, y: number},
    currentIndex: number
  ): boolean => {
    if (currentIndex >= currentPath.length) // Si hors des limites, mouvement invalide
        return false;
  
    const nextStep = currentPath[currentIndex];
    return nextStep.x === playerMove.x && nextStep.y === playerMove.y;
};

export const getArrowForPathSegment = (start: {x: number, y: number}, end: {x: number, y: number}): GridValue => {
    if (start.x < end.x) return 'right';
    if (start.x > end.x) return 'left';
    if (start.y < end.y) return 'bottom';
    if (start.y > end.y) return 'top';
    return 'back';
};

export const calculateScore = (context: { score: number, currentPath: { x: number; y: number }[], pathLength: number, currentIndex: number, startRoundTime: Date | null, isSlowMode: boolean, isHardcoreMode: boolean }): number => {
  if (!context.startRoundTime) {
    return context.score;
  }

  let factor = 1
  if (context.isHardcoreMode)
    factor = 2;
  if (context.isSlowMode)
    factor = 0.5;

  const endTime = new Date();
  const timeTaken = (endTime.getTime() - context.startRoundTime.getTime()) / 1000;
  const timeLimit = 10;
  const pathLengthFactor = Math.max(context.currentPath.length, 1);

  let newScore = Math.max((timeLimit - timeTaken) * (100 / timeLimit) / 2, 0);
  newScore *= pathLengthFactor * factor;
  return Math.floor(newScore);
}

export const isValidMove = (context: { currentIndex: number, pathLength: number, currentPath: { x: number; y: number }[] }, event: { nextPosition: { x: number; y: number } }): boolean => {
  if (event.nextPosition.x >= gridLength || event.nextPosition.x < 0 || event.nextPosition.y >= gridLength || event.nextPosition.y < 0) {
    return false;
  }
  return context.currentIndex + 1 < context.pathLength && 
    event.nextPosition.x === context.currentPath[context.currentIndex + 1].x && 
    event.nextPosition.y === context.currentPath[context.currentIndex + 1].y;
}

export const setInitialDemoIndex = (context: { currentPath: { x: number; y: number }[], isHardcoreMode: boolean, pathLength: number }): number => {
  // if it's hardcore mode, we start at the end of the path
  if (context.isHardcoreMode) {
    return context.pathLength - 1;
  } else {
    return 1;
  }
}