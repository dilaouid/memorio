import React from "react";

import startTile from "@assets/tiles/start.svg";
import rightTile from "@assets/tiles/right.svg";
import successTile from "@assets/tiles/success.svg";
import demoLamp from "@assets/lamp/demo.svg";

import "./styles.css";

type MenuProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (event: any) => void;
  bestScore: number;
};

export const Menu: React.FC<MenuProps> = ({ send, bestScore }) => {
  return (
    <div className="menu">
      <h1 className="logo">
        <img src="/favicon.svg" alt="" className="logo-gear" />
        Mémorio
        <img src="/favicon.svg" alt="" className="logo-gear reverse" />
      </h1>
      <p className="tagline">The Clockwork Memory Machine</p>

      <div className="panel how-to-play">
        <h2 className="panel-title">How to play</h2>
        <ol className="steps">
          <li>
            <img src={demoLamp} alt="" className="step-lamp" />
            <span>Watch the <b className="blue">blue lights</b> trace a path from the gear.</span>
          </li>
          <li>
            <span className="step-tiles">
              <img src={startTile} alt="" />
              <img src={rightTile} alt="" />
              <img src={successTile} alt="" />
            </span>
            <span>Repeat it with the <b>arrows</b>, <b>ZQSD/WASD</b> or by <b>clicking</b> the tiles.</span>
          </li>
          <li>
            <span className="step-icon">⚙</span>
            <span>Be quick for the bonus, chain rounds for a <b>combo</b>. Three mistakes and the boiler bursts!</span>
          </li>
        </ol>
      </div>

      <button className="brass-button start-button" onClick={() => send({ type: "START" })}>
        Start the machine
      </button>
      <p className="panel-hint">Press Enter to start{bestScore > 0 && <> · Best score: {bestScore}</>}</p>
    </div>
  );
};
