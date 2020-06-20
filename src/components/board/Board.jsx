import React, { useEffect, useState } from "react";
import { Container, Button, Header } from "semantic-ui-react";
import Node from "../node/Node";
import { NodeState } from "../../constants/NodeState";
import { getVisitedNodes, getShortestPath } from "../../algorithms/dijkstra";

const INITIAL_STATE = {
  sourceRow: 14,
  sourceColumn: 5,
  targetRow: 14,
  targetColumn: 40,
};

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
        currentRow.push(createNode(row, column, Infinity, NodeState.EMPTY));
      }
      grid.push(currentRow);
    }
    grid[INITIAL_STATE.sourceRow][INITIAL_STATE.sourceColumn] = createNode(
      INITIAL_STATE.sourceRow,
      INITIAL_STATE.sourceColumn,
      0,
      NodeState.SOURCE,
      true
    );
    grid[INITIAL_STATE.targetRow][INITIAL_STATE.targetColumn] = createNode(
      INITIAL_STATE.targetRow,
      INITIAL_STATE.targetColumn,
      Infinity,
      NodeState.TARGET,
      false
    );
    return grid;
  };

  const createNode = (row, column, distance, state, isVisited) => {
    return {
      row,
      column,
      distance,
      state,
      isVisited,
    };
  };

  const updateNode = (node, distance, state) => {
    return {
      ...node,
      distance,
      state,
    };
  };

  const dijkstra = () => {
    const visitedNodes = getVisitedNodes(grid);
    console.log(visitedNodes);
    // const shortestPath = getShortestPath(
    //   grid[INITIAL_STATE.targetRow][INITIAL_STATE.targetColumn]
    // );
    // console.log(shortestPath);

    visitedNodes.forEach((node, index) => {
      setTimeout(() => {
        console.log("mark");
        const newGrid = grid.slice();
        const newNode = {
          ...node,
          state: NodeState.VISITED,
        };
        newGrid[node.row][node.column] = newNode;
        setGrid(newGrid);
        // updateNode(item);
      }, index * 300);
    });
  };

  return (
    <>
      <Button onClick={dijkstra}>dew it</Button>
      <Container style={{ paddingTop: "5em" }}>
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex}>
              {row.map((node, nodeIndex) => {
                return <Node key={nodeIndex} node={node} />;
              })}
            </div>
          );
        })}
      </Container>
    </>
  );
};

export default Board;
