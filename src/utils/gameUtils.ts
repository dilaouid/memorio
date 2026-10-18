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
const tryGeneratePath = (pathLength: number): {x: number, y: number}[] => {
    // on commence par faire le start du chemin, n'importe où sur la grille
    const startX = Math.floor(Math.random() * gridLength);
    const startY = Math.floor(Math.random() * gridLength);
    const path = [{x: startX, y: startY}];
  
    // Générer un chemin aléatoire
    let currentX: number = startX, currentY = startY;
  
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
 * Génère un chemin de la longueur demandée (on réessaie si la marche aléatoire s'est bloquée)
 * @param pathLength La longueur du chemin à générer
 * @returns Le chemin le plus long obtenu, idéalement de longueur pathLength
*/
export const generatePath = (pathLength: number): {x: number, y: number}[] => {
    let best = tryGeneratePath(pathLength);
    for (let attempt = 0; attempt < 50 && best.length < pathLength; attempt++) {
        const candidate = tryGeneratePath(pathLength);
        if (candidate.length > best.length) best = candidate;
    }
    return best;
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
  const pathLengthFactor = Math.max(context.currentPath.length, 1);

  // a small base reward for completing the path, plus a speed bonus
  const speedBonus = Math.max(ROUND_TIME_LIMIT - timeTaken, 0) * (100 / ROUND_TIME_LIMIT) / 2;
  let newScore = 10 + speedBonus;
  newScore *= pathLengthFactor * factor;
  return Math.floor(newScore);
}

export const isValidMove = (context: { currentIndex: number, pathLength: number, currentPath: { x: number; y: number }[] }, event: { nextPosition: { x: number; y: number } }): boolean => {
  if (event.nextPosition.x >= gridLength || event.nextPosition.x < 0 || event.nextPosition.y >= gridLength || event.nextPosition.y < 0) {
    return false;
  }
  return context.currentIndex + 1 < context.currentPath.length && 
    event.nextPosition.x === context.currentPath[context.currentIndex + 1].x && 
    event.nextPosition.y === context.currentPath[context.currentIndex + 1].y;
}

export const setInitialDemoIndex = (context: { currentPath: { x: number; y: number }[], isHardcoreMode: boolean, pathLength: number }): number => {
  // if it's hardcore mode, we start at the end of the path
  if (context.isHardcoreMode) {
    return context.currentPath.length - 1;
  } else {
    return 1;
  }
}

export const MAX_LIVES = 3;
export const ROUND_TIME_LIMIT = 10; // seconds during which a faster answer earns more points

// Each consecutive perfect round adds +25% to the gains, up to x3.
export const getStreakMultiplier = (streak: number): number => 1 + Math.min(streak, 8) * 0.25;

// Pixel offset of a tile inside the play area (board border + tile with its border + grid gap).
const BOARD_BORDER = 10;
const TILE_STEP = 83;
export const tileOffset = (index: number): string => `${BOARD_BORDER + index * TILE_STEP + 12}px`;

const BEST_SCORE_KEY = "memorio:best-score";

export const loadBestScore = (): number => {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
};

export const saveBestScore = (score: number): void => {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // storage unavailable (private mode...), the best score just won't persist
  }
};
