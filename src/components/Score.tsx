import React from "react";

import { getStreakMultiplier, MAX_LIVES } from "@utils/gameUtils";

type ScoreProps = {
    isHardcoreMode: boolean;
    isSlowMode: boolean;
    score: number;
    bestScore: number;
    level: number;
    lives: number;
    streak: number;
};

// A small vacuum tube: lit when the life is still available.
const Valve: React.FC<{ lit: boolean }> = ({ lit }) => (
    <svg className={`valve ${lit ? "valve-lit" : ""}`} viewBox="0 0 24 40" width="22" height="36" aria-hidden="true">
        <rect x="5" y="2" width="14" height="26" rx="7" fill={lit ? "rgba(94,200,255,0.25)" : "rgba(20,10,5,0.6)"} stroke="#e6f6ff" strokeOpacity="0.4" />
        <path d="M12 24 V10 l-3 3 l6 3 l-6 3 l6 3" fill="none" stroke={lit ? "#d8f4ff" : "#4a2a18"} strokeWidth="1.6" />
        <rect x="3" y="27" width="18" height="11" rx="2" fill="#b5702c" />
        <rect x="3" y="27" width="18" height="3" fill="#ffd08a" opacity="0.6" />
    </svg>
);

export const Score: React.FC<ScoreProps> = ({ score, bestScore, level, lives, streak, isHardcoreMode, isSlowMode }) => {
    let scoreBonusContent = <></>;

    if (isHardcoreMode && !isSlowMode) {
        scoreBonusContent = <span className="hardcore">x2</span>;
    } else if (!isHardcoreMode && isSlowMode) {
        scoreBonusContent = <span className="slow">x0.5</span>;
    }

    const multiplier = getStreakMultiplier(streak);

    return (
        <div className="hud">
            <div className="hud-block">
                <span className="hud-label">Score</span>
                <span className="hud-value">{score} {scoreBonusContent}</span>
                <span className="hud-sub">Best {Math.max(bestScore, score)}</span>
            </div>
            <div className="hud-block">
                <span className="hud-label">Level</span>
                <span className="hud-value">{level}</span>
            </div>
            <div className={`hud-block combo ${multiplier > 1 ? "combo-active" : ""}`} key={streak}>
                <span className="hud-label">Combo</span>
                <span className="hud-value">x{multiplier}</span>
            </div>
            <div className="hud-block lives" title={`${lives} / ${MAX_LIVES}`}>
                {Array.from({ length: MAX_LIVES }, (_, i) => <Valve key={i} lit={i < lives} />)}
            </div>
        </div>
    );
};
