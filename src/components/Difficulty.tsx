import React from "react";

import { GiSnail } from "react-icons/gi";
import { FaSkull } from "react-icons/fa";

type DifficultyProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send: (event: any) => void;
    isHardcoreMode: boolean;
    isSlowMode: boolean;
    isDemoPlaying: boolean;
};

export const Difficulty: React.FC<DifficultyProps> = ({ send, isHardcoreMode, isSlowMode, isDemoPlaying }) => {
    return(<div className="corner-controls">
    <FaSkull
      className={`corner-icon ${isHardcoreMode ? 'active-danger' : ''}`}
      style={{ cursor: isDemoPlaying ? 'not-allowed' : 'pointer' }}
      title="Hardcore: faster demo, reversed path, x2 points"
      onClick={() => isDemoPlaying ? null : send({ type: 'SET_HARD_MODE' })}
      size="44px"
    />
    <GiSnail
      className={`corner-icon ${isSlowMode ? 'active' : ''}`}
      style={{ cursor: isDemoPlaying ? 'not-allowed' : 'pointer' }}
      title="Slow mode: slower demo, x0.5 points"
      onClick={() => isDemoPlaying ? null : send({ type: 'SET_SLOW_MODE' })}
      size="44px"
    />
  </div>)
};