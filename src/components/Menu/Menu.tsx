import React from "react";

import logoImage from "../../assets/menu/logo.png";
import howToPlayImage from "../../assets/menu/how-to-play.png";
import startFrameImage from "../../assets/menu/start-frame.png";
import startButtonImage from "../../assets/menu/start-button.png";

import "./styles.css";


type MenuProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (event: any) => void;
};


export const Menu: React.FC<MenuProps> = ({ send }) => {
  return (
    <div style={{ position: "absolute", zIndex: 5 }}>
      <img src={logoImage} alt="Logo Memorio" className="logo" />
      <div className="how-to-play-section">
        <img src={howToPlayImage} alt="How to Play" className="how-to-play" />
      </div>
      <div className="button">
        <img src={startFrameImage} alt="Start Game Button Border" />
        <img
          className="start-button"
          src={startButtonImage}
          alt="Start the game"
          onClick={() => {
            send({ type: "START" });
          }}
        />
      </div>
    </div>
  );
};
