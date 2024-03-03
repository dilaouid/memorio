import React from "react";

type ScoreProps = {
    isHardcoreMode: boolean;
    isSlowMode: boolean;
    score: number;
};

export const Score: React.FC<ScoreProps> = ({ score, isHardcoreMode, isSlowMode }) => {
    let scoreBonusContent = <></>;

    if (isHardcoreMode && !isSlowMode) {
        scoreBonusContent = <span className="hardcore">x2</span>;
    } else if (!isHardcoreMode && isSlowMode) {
        scoreBonusContent = <span className="slow">x0.5</span>;
    }

    return (
        <div className="score-display">
            Score: {score} {scoreBonusContent}
        </div>
    );
};