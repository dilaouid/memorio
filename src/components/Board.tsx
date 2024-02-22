import React from 'react';
import { Tile } from './Tile';

type BoardProps = {
  grid: ('start' | 'left' | 'right' | 'top' | 'bottom' | 'back')[][];
};

export const Board: React.FC<BoardProps> = ({ grid }) => {
  return (
    <div className="board">
      {grid.map((row, rowIndex) =>
        row.map((type, columnIndex) => <Tile key={`${rowIndex}-${columnIndex}`} type={type} />)
      )}
    </div>
  );
};