import React from 'react';

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
  const getImage = (type: TileProps['type']) => {
    switch (type) {
      case 'start':
        return startImage;
      case 'left':
        return leftImage;
      case 'right':
        return rightImage;
      case 'top':
        return topImage;
      case 'bottom':
        return bottomImage;
      default:
        return backImage;
    }
  };

  return <div className="tile" style={{ backgroundImage: `url(${getImage(type)})` }} />;
};