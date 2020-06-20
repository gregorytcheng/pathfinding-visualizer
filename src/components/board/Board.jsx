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
  const [nodesVisited, setNodesVisited] = useState(0);
  const [timeToComplete, setTimeToComplete] = useState(0);

  const TIME_INTERVAL_LENGTH = 65;

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
      distanceToDisplay: distance,
      state,
      isVisited,
    };
  };

  const dijkstra = () => {
    const timeStart = performance.now();
    const visitedNodes = getVisitedNodes(grid);
    const shortestPath = getShortestPath(
      grid[INITIAL_STATE.targetRow][INITIAL_STATE.targetColumn]
    );
    const timeEnd = performance.now();

    console.log(shortestPath);

    visitedNodes.forEach((node, index) => {
      // Skipping the first one in order to preserve the style
      if (index !== 0) {
        setTimeout(() => {
          const newGrid = grid.slice();
          const newNode = {
            ...node,
            state: NodeState.VISITED,
            distanceToDisplay: node.distance,
          };
          newGrid[node.row][node.column] = newNode;
          setGrid(newGrid);
          setNodesVisited((nodesVisited) => nodesVisited + 1);
        }, index * TIME_INTERVAL_LENGTH);
      }
    });

    shortestPath.forEach((node, index) => {
      if (index !== 0 && index !== shortestPath.length - 1) {
        setTimeout(() => {
          const newGrid = grid.slice();
          const newNode = {
            ...node,
            distanceToDisplay: node.distance,
            state: NodeState.SHORTEST_PATH,
          };
          newGrid[node.row][node.column] = newNode;
          setGrid(newGrid);
        }, visitedNodes.length * TIME_INTERVAL_LENGTH + index * TIME_INTERVAL_LENGTH);
      }
      if (index === shortestPath.length - 1) {
        setTimeout(() => {
          const newGrid = grid.slice();
          const newNode = {
            ...node,
            distanceToDisplay: node.distance,
          };
          newGrid[node.row][node.column] = newNode;
          setGrid(newGrid);
        }, visitedNodes.length * TIME_INTERVAL_LENGTH + (shortestPath.length - 1) * TIME_INTERVAL_LENGTH);
      }
    });

    // set time to complete
    setTimeout(() => {
      setTimeToComplete(timeEnd - timeStart);
    }, visitedNodes.length * TIME_INTERVAL_LENGTH + shortestPath.length * TIME_INTERVAL_LENGTH);
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
        <Header> Nodes visited: {nodesVisited}</Header>
        <Header> Time to complete: {timeToComplete.toFixed(0)} ms</Header>
      </Container>
    </>
  );
};

export default Board;
