import { GridValue } from "../types/GridValue";

type EmptyGrid = ('back' | 'start')[][];

/**
 * Génère un plateau de jeu initial rempli des cases non révélées
 * @param rows
 * @param cols
 * @returns Un tableau 2D initialisé avec 'back' pour toutes les cases
*/
export const generateInitialGrid = (rows: number, cols: number, path: {x: number, y: number}[]): ('back' | 'start')[][] => {
    const grid: EmptyGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 'back'));

    const startX = path[0].x;
    const startY = path[0].y;
    grid[startY][startX] = 'start';

    return grid;
};
  

/**
 * Sélectionne une case de départ aléatoire et génère un chemin à partir de celle-ci
 * @param grid Le plateau de jeu
 * @returns Le chemin généré sous forme d'une liste de coordonnées {x, y}
*/
export const generatePath = (rows: number, cols: number, pathLength: number): {x: number, y: number}[] => {
    // on commence par faire le start du chemin
    const startX = Math.floor(Math.random() * cols);
    const startY = Math.floor(Math.random() * rows);
    const path = [{x: startX, y: startY}];
  
    // Générer un chemin aléatoire
    let currentX = startX;
    let currentY = startY;
  
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
          pos.x >= 0 && pos.x < cols &&
          pos.y >= 0 && pos.y < rows &&
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

export const calculateScore = (context: { score: number, currentPath: { x: number; y: number }[], pathLength: number, currentIndex: number, startRoundTime: Date | null }): number => {
  if (!context.startRoundTime) {
    return context.score;
  }

  const endTime = new Date();
  const timeTaken = (endTime.getTime() - context.startRoundTime.getTime()) / 1000;
  const timeLimit = 10;
  const pathLengthFactor = Math.max(context.currentPath.length, 1);

  let newScore = Math.max((timeLimit - timeTaken) * (100 / timeLimit) / 2, 0);
  newScore *= pathLengthFactor;
  return Math.floor(newScore);
}

export const isValidMove = (context: { currentIndex: number, pathLength: number, currentPath: { x: number; y: number }[] }, event: { nextPosition: { x: number; y: number } }): boolean => {
  return context.currentIndex + 1 < context.pathLength && 
    event.nextPosition.x === context.currentPath[context.currentIndex + 1].x && 
    event.nextPosition.y === context.currentPath[context.currentIndex + 1].y;
}