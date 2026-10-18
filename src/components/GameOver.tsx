import React from "react";

type GameOverProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send: (event: any) => void;
    score: number;
    bestScore: number;
    level: number;
};

export const GameOver: React.FC<GameOverProps> = ({ send, score, bestScore, level }) => {
    const isNewRecord = score > 0 && score >= bestScore;
    return (
        <div className="overlay">
            <div className="panel game-over">
                <h2 className="panel-title">Boiler Burst</h2>
                <p className="panel-text">The machine ran out of valves at level {level}.</p>
                <div className="final-score">{score}</div>
                {isNewRecord
                    ? <div className="new-record">New record!</div>
                    : <div className="panel-text">Best: {bestScore}</div>}
                <div className="panel-actions">
                    <button className="brass-button" onClick={() => send({ type: "RESTART" })} autoFocus>Restart</button>
                    <button className="brass-button secondary" onClick={() => send({ type: "BACK_TO_MENU" })}>Menu</button>
                </div>
                <p className="panel-hint">Press Enter to restart</p>
            </div>
        </div>
    );
};
