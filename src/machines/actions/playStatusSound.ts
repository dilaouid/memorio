import { sounds } from "@assets/sfx/sounds";

export const playStatusSound = (context: GameContext) => {
  switch (context.status) {
    case "yourTurn": {
      const audio = new Audio(sounds.start);
      audio.play().catch((err) => console.error("Error playing start sound:", err));
      break;
    }
    case "error": {
      const audio = new Audio(sounds.invalid);
      audio.play().catch((err) => console.error("Error playing invalid sound:", err));
      break;
    }
    case "success": {
      const audio = new Audio(sounds.valid);
      audio.play().catch((err) => console.error("Error playing valid sound:", err));
      break;
    }
    default:
      break;
  }
};