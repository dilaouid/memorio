import React from 'react';
import { Tile } from './Tile';
import { GridValue } from '../types/GridValue';

type BoardProps = {
  grid: (GridValue)[][];
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