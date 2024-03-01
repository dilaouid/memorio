import React from "react";
import { Tile } from "./Tile";
import { GridValue } from "../types/GridValue";

type BoardProps = {
  grid: GridValue[][];
};

export const Board: React.FC<BoardProps> = ({ grid }) => {
  const gridSize: string = import.meta.env.VITE_GRID_SIZE || "7";
  const boardStyle = {
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
  };
  return (
    <div className="board" style={boardStyle}>
      {grid.map((row, rowIndex) =>
        row.map((type, columnIndex) => (
          <Tile key={`${rowIndex}-${columnIndex}`} type={type} />
        ))
      )}
    </div>
  );
};
