import React, { useEffect, useState } from "react";
import { Container, Button, Header } from "semantic-ui-react";
import Node from "../node/Node";

const Board = () => {
  const [grid, setGrid] = useState([[]]);

  useEffect(() => {
    setGrid(getInitialGrid());
  }, []);

  const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 30; row++) {
      const currentRow = [];
      for (let column = 0; column < 45; column++) {
        currentRow.push(createNode(column, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const createNode = (column, row) => {
    return {
      column,
      row,
    };
  };

  return (
    <>
      <Container style={{ paddingTop: "5em" }}>
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex}>
              {row.map((node, nodeIndex) => {
                return <Node key={nodeIndex}>test</Node>;
              })}
            </div>
          );
        })}
      </Container>
    </>
  );
};

export default Board;
