import React from "react";
import { ScorePopupProps } from "../types/ScorePopupProps";

const ScorePopup: React.FC<ScorePopupProps> = ({ score, top, left }) => {
  const color = score > 0 ? "green" : "red";
  const scoreStyle: React.CSSProperties = {
    position: "absolute",
    top,
    left,
    color,
    opacity: 1,
    transition: "opacity 4s ease-out, top 4s ease-out",
    fontFamily: '"Press Start 2P", cursive',
  };

  return (
    <div
      style={scoreStyle}
      className={`score-popup ${score > 0 ? "positive" : "negative"}`}
    >
      {score > 0 ? `+${score}` : score}
    </div>
  );
};

export default ScorePopup;
