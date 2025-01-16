import startSound from "@assets/sfx/start.wav";
import invalidSound from "@assets/sfx/invalid.wav";
import validSound from "@assets/sfx/valid.wav";
import flipSound from "@assets/sfx/flip.wav";
import menuBgm from "@assets/sfx/bgm_menu.mp3";
import gameBgm from "@assets/sfx/bgm_game.mp3";

export const sounds = {
  start: startSound,
  invalid: invalidSound,
  valid: validSound,
  flip: flipSound,
  menuBgm: menuBgm,
  gameBgm: gameBgm,
} as const;
