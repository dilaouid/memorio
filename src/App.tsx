import useSound from "use-sound";

import { Game } from "./components/Game";
import "./App.css";


import bgmGame from "./assets/sfx/bgm_game.mp3";
import bgmMenu from "./assets/sfx/bgm_menu.mp3";

function App() {
  const [playBGMGame, { stop: stopBGMGame }] = useSound(bgmGame, { loop: true });
  const [playBGMMenu, { stop: stopBGMMenu }] = useSound(bgmMenu, { loop: true });

  return (
    <div>
      <Game
        playBGMMenu={playBGMMenu}
        playBGMGame={playBGMGame}
        stopBGMGame={stopBGMGame}
        stopBGMMenu={stopBGMMenu}
      />
    </div>
  );
}

export default App;
