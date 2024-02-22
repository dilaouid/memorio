import React, { useEffect, useState } from 'react';

import startImage from '../assets/start.jpg';
import leftImage from '../assets/left.jpg';
import rightImage from '../assets/right.jpg';
import topImage from '../assets/top.jpg';
import bottomImage from '../assets/bottom.jpg';
import backImage from '../assets/back.jpg';

type TileProps = {
  type: 'start' | 'left' | 'right' | 'top' | 'bottom' | 'back';
};

export const Tile: React.FC<TileProps> = ({ type }) => {
    const [flipped, setFlipped] = useState(false);
  
    const getImage = (type: TileProps['type']) => {
      switch (type) {
        case 'start': return startImage;
        case 'left': return leftImage;
        case 'right': return rightImage;
        case 'top': return topImage;
        case 'bottom': return bottomImage;
        default: return backImage;
      }
    };
  
    useEffect(() => {
        setFlipped(true);
        const timer = setTimeout(() => setFlipped(false), 50);
        return () => clearTimeout(timer);
    }, [type]);
  
    return (
      <div className="tile">
        <div className={`tileInner ${flipped ? 'tileFlipped' : ''}`}>
          <div className="front" style={{ backgroundImage: `url(${getImage(type)})` }} />
          <div className="back" style={{ backgroundImage: `url(${getImage('back')})` }} />
        </div>
      </div>
    );
};  