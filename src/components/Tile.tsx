import React, { useEffect, useState } from 'react';

import startImage from '@assets/tiles/start.jpg';
import leftImage from '@assets/tiles/left.jpg';
import rightImage from '@assets/tiles/right.jpg';
import topImage from '@assets/tiles/top.jpg';
import bottomImage from '@assets/tiles/bottom.jpg';
import backImage from '@assets/tiles/back.jpg';
import failImage from '@assets/tiles/fail.jpg';
import successImage from '@assets/tiles/success.jpg';

type TCoordinates = { x: number; y: number };
type TMouseEmitter = { __mouseListener?: { emit: (pos: TCoordinates) => void } }

interface TileProps {
  type: GridValue;
  position: TCoordinates;
}

export const Tile: React.FC<TileProps> = ({ type, position }) => {
    const [flipped, setFlipped] = useState(false);
  
    const getImage = (type: GridValue) => {
      switch (type) {
        case 'start': return startImage;
        case 'left': return leftImage;
        case 'right': return rightImage;
        case 'top': return topImage;
        case 'bottom': return bottomImage;
        case 'fail': return failImage;
        case 'success': return successImage;
        default: return backImage;
      }
    };

    const handleClick = () => {
      (window as TMouseEmitter).__mouseListener?.emit(position);
    };

    useEffect(() => {
        setFlipped(true);
        const timer = setTimeout(() => setFlipped(false), 50);
        return () => clearTimeout(timer);
    }, [type]);
  
    return (
      <div className="tile" onClick={handleClick}>
        <div className={`tileInner ${flipped ? 'tileFlipped' : ''}`}>
          <div className="front" style={{ backgroundImage: `url(${getImage(type)})` }} />
          <div className="back" style={{ backgroundImage: `url(${getImage('back')})` }} />
        </div>
      </div>
    );
};  