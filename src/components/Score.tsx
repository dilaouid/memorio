import React from "react";

type ScoreProps = {
    isHardcoreMode: boolean;
    isSlowMode: boolean;
    score: number;
};

export const Score: React.FC<ScoreProps> = ({ score, isHardcoreMode, isSlowMode }) => {
    const ScoreBonus = isHardcoreMode || isSlowMode ? <span className={isHardcoreMode ? "hardcore" : "slow"}>x{ isHardcoreMode ? 2 : 0.5 } </span> : <></>;
    return(<div className="score-display">Score: {score} { isHardcoreMode && isSlowMode ? null : ScoreBonus } </div>)
};