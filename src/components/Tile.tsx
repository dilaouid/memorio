import React, { useEffect, useState } from 'react';
import { GridValue } from '../types/GridValue';

import startImage from '../assets/tiles/start.jpg';
import leftImage from '../assets/tiles/left.jpg';
import rightImage from '../assets/tiles/right.jpg';
import topImage from '../assets/tiles/top.jpg';
import bottomImage from '../assets/tiles/bottom.jpg';
import backImage from '../assets/tiles/back.jpg';
import failImage from '../assets/tiles/fail.jpg';
import successImage from '../assets/tiles/success.jpg';

export const Tile: React.FC<{ type: GridValue }> = ({ type }) => {
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