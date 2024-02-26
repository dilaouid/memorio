import React from 'react';

import demoLamp from '../assets/demo_lamp.png';
import errorLamp from '../assets/error_lamp.png';
import successLamp from '../assets/success_lamp.png';
import yourTurnLamp from '../assets/your_turn_lamp.png';

type StatusLampProps = {
  status: 'demo' | 'error' | 'success' | 'yourTurn';
  gridSize: number;
};

const StatusLamp: React.FC<StatusLampProps> = ({ status, gridSize }) => {
  let lampImage;

  const tileSize = 80;
  const boardBorderWidth = 10;

  const rightPosition = -tileSize;
  const topPosition = (tileSize * gridSize) - (tileSize * 3) - boardBorderWidth;

  const lampStyle = {
    right: `${rightPosition}px`,
    top: `${topPosition}px`,
  };

  switch (status) {
    case 'demo':
      lampImage = demoLamp;
      break;
    case 'error':
      lampImage = errorLamp;
      break;
    case 'success':
      lampImage = successLamp;
      break;
    case 'yourTurn':
      lampImage = yourTurnLamp;
      break;
    default:
      lampImage = yourTurnLamp;
  }

  return <img src={lampImage} alt="Status Lamp" className='status-lamp' style={lampStyle} />;
};

export default StatusLamp;