export const playSoundAssign = (_context: GameContext, event: GameEvent) => {
  if (event.type === "PLAY_SOUND") {
    const audio = new Audio(event.audioUrl);
    audio.currentTime = 0;
    if (event.rate) {
      // let the pitch climb with the rate, it makes long chains feel like a crescendo
      audio.preservesPitch = false;
      audio.playbackRate = event.rate;
    }
    audio.play().catch((err) => console.error("Error playing sound:", err));
  }
};
