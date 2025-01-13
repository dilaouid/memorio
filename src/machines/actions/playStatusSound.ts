export const playStatusSound = (context: GameContext) => {
  switch (context.status) {
    case "yourTurn": {
      const audio = new Audio("/memorio/src/assets/sfx/start.wav");
      audio.play().catch((err) => console.error("Error playing start sound:", err));
      break;
    }
    case "error": {
      const audio = new Audio("/memorio/src/assets/sfx/invalid.wav");
      audio.play().catch((err) => console.error("Error playing invalid sound:", err));
      break;
    }
    case "success": {
      const audio = new Audio("/memorio/src/assets/sfx/valid.wav");
      audio.play().catch((err) => console.error("Error playing valid sound:", err));
      break;
    }
    default:
      break;
  }
};