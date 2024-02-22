/**
 * Génère un plateau de jeu initial rempli des cases non révélées
 * @param rows
 * @param cols
 * @returns Un tableau 2D initialisé avec 'back' pour toutes les cases
*/
export const generateInitialGrid = (rows: number, cols: number): ('back')[][] => {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 'back'));
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
    for (let i = 0; i < pathLength; i++) {
      const direction = Math.floor(Math.random() * 4); // 0: haut, 1: droite, 2: bas, 3: gauche
      switch (direction) {
        case 0: // haut
          if (currentY > 0) currentY -= 1;
          break;
        case 1: // droite
          if (currentX < cols - 1) currentX += 1;
          break;
        case 2: // bas
          if (currentY < rows - 1) currentY += 1;
          break;
        case 3: // gauche
          if (currentX > 0) currentX -= 1;
          break;
      }
      path.push({x: currentX, y: currentY});
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