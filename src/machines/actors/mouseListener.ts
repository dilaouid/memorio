import { fromCallback } from "xstate";
const env = import.meta.env;

export const mouseListener = fromCallback(({ input, sendBack }) => {
  const context = input as GameContext;
  if (!context) return;

  const handleTileClick = (position: { x: number; y: number }) => {
    const isDemoPlaying = context.isDemoPlaying ?? false;
    const status = context.status ?? "demo";
    const currentIndex = context.currentIndex ?? 0;

    if (isDemoPlaying || status === "success" || status === "error") return;

    const lastConfirmedPosition = context.currentPath[currentIndex];
    if (!lastConfirmedPosition) return;

    // Calculer la direction basée sur la différence de position
    const dx = position.x - lastConfirmedPosition.x;
    const dy = position.y - lastConfirmedPosition.y;

    // Vérifier que le click est sur une case adjacente
    if (Math.abs(dx) + Math.abs(dy) !== 1) return;

    const gridSize = Number(env.VITE_GRID_SIZE);

    // Vérifications des limites et du retour en arrière
    if (
      (position.x === context.currentPath[0].x &&
        position.y === context.currentPath[0].y) ||
      position.x > gridSize - 1 ||
      position.x < 0 ||
      position.y > gridSize - 1 ||
      position.y < 0
    )
      return;

    let direction: GridValue;
    if (dx === 1) direction = "right";
    else if (dx === -1) direction = "left";
    else if (dy === 1) direction = "bottom";
    else direction = "top";

    sendBack({
      type: "PLAY_SOUND",
      audioUrl: "/memorio/src/assets/sfx/flip.wav",
    });
    sendBack({
      type: "MOVE",
      direction,
      nextPosition: position,
    });
  };

  // Créer un event emitter personnalisé pour la communication
  const eventEmitter = {
    emit: handleTileClick,
  };

  type EmitterWindow = Window &
    typeof globalThis & { __mouseListener?: typeof eventEmitter };

  // Exposer l'emitter à l'extérieur via window
  (window as EmitterWindow).__mouseListener = eventEmitter;

  return () => {
    delete (window as EmitterWindow).__mouseListener;
  };
});
