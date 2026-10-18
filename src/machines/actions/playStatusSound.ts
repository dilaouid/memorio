import { sounds } from "@assets/sfx/sounds";

const play = (url: string, rate = 1) => {
  const audio = new Audio(url);
  audio.preservesPitch = false;
  audio.playbackRate = rate;
  audio.play().catch((err) => console.error("Error playing sound:", err));
};

export const playStatusSound = (context: GameContext) => {
  switch (context.status) {
    case "yourTurn":
      play(sounds.start);
      break;
    case "error":
      play(sounds.invalid, context.lives === 0 ? 0.7 : 1);
      break;
    case "success":
      // the success chime gets higher as the combo grows
      play(sounds.valid, 1 + Math.min(context.streak, 8) * 0.05);
      break;
    default:
      break;
  }
};
