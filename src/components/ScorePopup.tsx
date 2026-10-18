import React from "react";

const ScorePopup: React.FC<ScorePopupProps> = ({ score, top, left, label }) => {
  return (
    <div
      style={{ top, left }}
      className={`score-popup ${score > 0 ? "positive" : "negative"}`}
    >
      {score !== 0 && (score > 0 ? `+${score}` : score)}
      {label && <span className="score-popup-label">{label}</span>}
    </div>
  );
};

export default ScorePopup;
