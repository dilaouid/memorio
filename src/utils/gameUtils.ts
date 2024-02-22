import { GridValue } from "../types/GridValue";

type EmptyGrid = ('back' | 'start')[][];

/**
 * Génère un plateau de jeu initial rempli des cases non révélées
 * @param rows
 * @param cols
 * @returns Un tableau 2D initialisé avec 'back' pour toutes les cases
*/
export const generateInitialGrid = (rows: number, cols: number, path: {x: number, y: number}[]): ('back' | 'start')[][] => {
    let grid: EmptyGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 'back'));

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
export const generatePath = (rows: number, cols: number): {x: number, y: number}[] => {
    const startX = Math.floor(Math.random() * cols);
    const startY = Math.floor(Math.random() * rows);
    const path = [{x: startX, y: startY}];
  
    // Générer un chemin aléatoire
    let currentX = startX;
    let currentY = startY;
  
    const pathLength = 5;
    const getPossibleMoves = (currentX: number, currentY: number, path: {x: number, y: number}[]) => {
        const moves = [];
        if (currentY > 0 && !path.some(p => p.x === currentX && p.y === currentY - 1))
            moves.push({x: currentX, y: currentY - 1}); // Haut
        if (currentY < rows - 1 && !path.some(p => p.x === currentX && p.y === currentY + 1))
            moves.push({x: currentX, y: currentY + 1}); // Bas
        if (currentX > 0 && !path.some(p => p.x === currentX - 1 && p.y === currentY))
            moves.push({x: currentX - 1, y: currentY}); // Gauche
        if (currentX < cols - 1 && !path.some(p => p.x === currentX + 1 && p.y === currentY))
            moves.push({x: currentX + 1, y: currentY}); // Droite
        return moves;
    };

    while (path.length < pathLength) {
        const possibleMoves = getPossibleMoves(currentX, currentY, path);
        if (possibleMoves.length === 0) break;
        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        path.push(move);
        currentX = move.x;
        currentY = move.y;
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