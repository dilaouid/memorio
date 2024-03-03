import React from "react";
import { MdSlowMotionVideo } from 'react-icons/md';
import { FaSkull } from "react-icons/fa";

type DifficultyProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send: (event: any) => void;
    isHardcoreMode: boolean;
    isSlowMode: boolean;
    isDemoPlaying: boolean;
};

export const Difficulty: React.FC<DifficultyProps> = ({ send, isHardcoreMode, isSlowMode, isDemoPlaying }) => {
    return(<div style={{ 
        position: "fixed", top: 0, left: 0, padding: '10px' }}>
    <FaSkull
      style={{
        color: isHardcoreMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
        marginRight: '10px',
      }}
      onClick={() => isDemoPlaying ? null : send({ type: 'SET_HARD_MODE' })}
      size="54px"
    />
    <MdSlowMotionVideo
      style={{
        color: isSlowMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
      }}
      onClick={() => isDemoPlaying ? null : send({ type: 'SET_SLOW_MODE' })}
      size="54px"
    />
  </div>)
};